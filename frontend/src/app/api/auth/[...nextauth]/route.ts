import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local`, {
            method: 'POST',
            body: JSON.stringify({
              identifier: credentials.email,
              password: credentials.password,
            }),
            headers: { 'Content-Type': 'application/json' }
          })

          const user = await res.json()

          if (res.ok && user.jwt) {
            return {
              id: user.user.id,
              name: user.user.username,
              email: user.user.email,
              jwt: user.jwt,
            }
          }
        } catch (error) {
          console.error('Auth error:', error)
        }
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.jwt = (user as any).jwt
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      (session as any).jwt = token.jwt;
      (session as any).id = token.id;
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
