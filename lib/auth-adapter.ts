import type { Adapter } from "@auth/core/adapters"
import { sql } from "./db"
import { generateId } from "./db"

export function NeonAdapter(): Adapter {
  return {
    async createUser(user) {
      const id = generateId()
      const result = await sql`
        INSERT INTO users (id, name, email, email_verified, image)
        VALUES (${id}, ${user.name}, ${user.email}, ${user.emailVerified}, ${user.image})
        RETURNING id, name, email, email_verified as "emailVerified", image
      `
      return result[0]
    },

    async getUser(id) {
      const result = await sql`
        SELECT id, name, email, email_verified as "emailVerified", image
        FROM users
        WHERE id = ${id}
      `
      return result[0] || null
    },

    async getUserByEmail(email) {
      const result = await sql`
        SELECT id, name, email, email_verified as "emailVerified", image
        FROM users
        WHERE email = ${email}
      `
      return result[0] || null
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const result = await sql`
        SELECT u.id, u.name, u.email, u.email_verified as "emailVerified", u.image
        FROM users u
        JOIN accounts a ON u.id = a.user_id
        WHERE a.provider_account_id = ${providerAccountId}
        AND a.provider = ${provider}
      `
      return result[0] || null
    },

    async updateUser(user) {
      const result = await sql`
        UPDATE users
        SET name = ${user.name}, email = ${user.email}, email_verified = ${user.emailVerified}, image = ${user.image}
        WHERE id = ${user.id}
        RETURNING id, name, email, email_verified as "emailVerified", image
      `
      return result[0]
    },

    async deleteUser(userId) {
      await sql`DELETE FROM users WHERE id = ${userId}`
      return
    },

    async linkAccount(account) {
      const id = generateId()
      await sql`
        INSERT INTO accounts (
          id, user_id, type, provider, provider_account_id, 
          refresh_token, access_token, expires_at, token_type, scope, id_token, session_state
        )
        VALUES (
          ${id}, ${account.userId}, ${account.type}, ${account.provider}, ${account.providerAccountId},
          ${account.refresh_token}, ${account.access_token}, ${account.expires_at}, 
          ${account.token_type}, ${account.scope}, ${account.id_token}, ${account.session_state}
        )
      `
      return account
    },

    async unlinkAccount({ providerAccountId, provider }) {
      await sql`
        DELETE FROM accounts
        WHERE provider_account_id = ${providerAccountId}
        AND provider = ${provider}
      `
      return
    },

    async createSession({ sessionToken, userId, expires }) {
      const id = generateId()
      const result = await sql`
        INSERT INTO sessions (id, user_id, session_token, expires)
        VALUES (${id}, ${userId}, ${sessionToken}, ${expires})
        RETURNING id, session_token as "sessionToken", user_id as "userId", expires
      `
      return result[0]
    },

    async getSessionAndUser(sessionToken) {
      const result = await sql`
        SELECT 
          s.id as session_id, s.session_token as "sessionToken", s.user_id as "userId", s.expires,
          u.id, u.name, u.email, u.email_verified as "emailVerified", u.image
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.session_token = ${sessionToken}
      `
      if (result.length === 0) return null

      const { session_id, sessionToken: token, userId, expires, ...user } = result[0]
      return {
        session: { id: session_id, sessionToken: token, userId, expires },
        user,
      }
    },

    async updateSession({ sessionToken, expires, userId }) {
      const result = await sql`
        UPDATE sessions
        SET expires = ${expires}, user_id = ${userId}
        WHERE session_token = ${sessionToken}
        RETURNING id, session_token as "sessionToken", user_id as "userId", expires
      `
      return result[0] || null
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
      return { identifier, expires, token }
    },

    async useVerificationToken({ identifier, token }) {
      const result = await sql`
        DELETE FROM verification_tokens
        WHERE identifier = ${identifier} AND token = ${token}
        RETURNING identifier, token, expires
      `
      return result[0] || null
    },
  }
}
