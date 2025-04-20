import { sql } from "@/lib/db"
import type { Adapter } from "@auth/core/adapters"

export function NeonAdapter(): Adapter {
  return {
    async createUser(user) {
      const id = crypto.randomUUID()
      const result = await sql`
        INSERT INTO users (id, name, email, email_verified, image)
        VALUES (${id}, ${user.name}, ${user.email}, ${user.emailVerified}, ${user.image})
        RETURNING id, name, email, email_verified, image
      `
      return {
        id: result[0].id,
        name: result[0].name,
        email: result[0].email,
        emailVerified: result[0].email_verified,
        image: result[0].image,
      }
    },

    async getUser(id) {
      const result = await sql`
        SELECT id, name, email, email_verified, image
        FROM users
        WHERE id = ${id}
      `
      if (result.length === 0) return null
      return {
        id: result[0].id,
        name: result[0].name,
        email: result[0].email,
        emailVerified: result[0].email_verified,
        image: result[0].image,
      }
    },

    async getUserByEmail(email) {
      const result = await sql`
        SELECT id, name, email, email_verified, image
        FROM users
        WHERE email = ${email}
      `
      if (result.length === 0) return null
      return {
        id: result[0].id,
        name: result[0].name,
        email: result[0].email,
        emailVerified: result[0].email_verified,
        image: result[0].image,
      }
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const result = await sql`
        SELECT u.id, u.name, u.email, u.email_verified, u.image
        FROM users u
        JOIN accounts a ON u.id = a.user_id
        WHERE a.provider_id = ${provider} AND a.provider_account_id = ${providerAccountId}
      `
      if (result.length === 0) return null
      return {
        id: result[0].id,
        name: result[0].name,
        email: result[0].email,
        emailVerified: result[0].email_verified,
        image: result[0].image,
      }
    },

    async updateUser(user) {
      const result = await sql`
        UPDATE users
        SET name = ${user.name}, email = ${user.email}, email_verified = ${user.emailVerified}, image = ${user.image}
        WHERE id = ${user.id}
        RETURNING id, name, email, email_verified, image
      `
      return {
        id: result[0].id,
        name: result[0].name,
        email: result[0].email,
        emailVerified: result[0].email_verified,
        image: result[0].image,
      }
    },

    async deleteUser(userId) {
      await sql`DELETE FROM users WHERE id = ${userId}`
      return
    },

    async linkAccount(account) {
      await sql`
        INSERT INTO accounts (
          user_id, provider_id, provider_type, provider_account_id, refresh_token, access_token, expires_at, token_type, scope, id_token
        )
        VALUES (
          ${account.userId}, ${account.provider}, ${account.type}, ${account.providerAccountId}, ${account.refresh_token}, 
          ${account.access_token}, ${account.expires_at}, ${account.token_type}, ${account.scope}, ${account.id_token}
        )
      `
      return account
    },

    async unlinkAccount({ providerAccountId, provider }) {
      await sql`
        DELETE FROM accounts
        WHERE provider_id = ${provider} AND provider_account_id = ${providerAccountId}
      `
      return
    },

    async createSession({ sessionToken, userId, expires }) {
      await sql`
        INSERT INTO sessions (user_id, expires, session_token)
        VALUES (${userId}, ${expires}, ${sessionToken})
      `
      return {
        userId,
        sessionToken,
        expires,
      }
    },

    async getSessionAndUser(sessionToken) {
      const result = await sql`
        SELECT s.user_id, s.expires, s.session_token, u.id, u.name, u.email, u.email_verified, u.image
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.session_token = ${sessionToken}
      `
      if (result.length === 0) return null
      return {
        session: {
          userId: result[0].user_id,
          expires: result[0].expires,
          sessionToken: result[0].session_token,
        },
        user: {
          id: result[0].id,
          name: result[0].name,
          email: result[0].email,
          emailVerified: result[0].email_verified,
          image: result[0].image,
        },
      }
    },

    async updateSession({ sessionToken, expires, userId }) {
      const result = await sql`
        UPDATE sessions
        SET expires = ${expires}
        WHERE session_token = ${sessionToken}
        RETURNING user_id, expires, session_token
      `
      if (result.length === 0) return null
      return {
        userId: result[0].user_id,
        sessionToken: result[0].session_token,
        expires: result[0].expires,
      }
    },

    async deleteSession(sessionToken) {
      await sql`DELETE FROM sessions WHERE session_token = ${sessionToken}`
      return
    },

    async createVerificationToken({ identifier, expires, token }) {
      await sql`
        INSERT INTO verification_tokens (identifier, token, expires)
        VALUES (${identifier}, ${token}, ${expires})
      `
      return {
        identifier,
        token,
        expires,
      }
    },

    async useVerificationToken({ identifier, token }) {
      const result = await sql`
        DELETE FROM verification_tokens
        WHERE identifier = ${identifier} AND token = ${token}
        RETURNING identifier, token, expires
      `
      if (result.length === 0) return null
      return {
        identifier: result[0].identifier,
        token: result[0].token,
        expires: result[0].expires,
      }
    },
  }
}
