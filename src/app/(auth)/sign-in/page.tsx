"use client";

import { authClient } from "~/lib/auth-client";

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-[#FFE600] text-black">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8">

        {/* Header */}
        <header className="flex items-center justify-between border-b-4 border-black pb-5">
          <h1 className="text-4xl font-black tracking-tight">
            RELAY
          </h1>

          <div className="border-2 border-black px-4 py-2 text-xs font-black uppercase">
            AI EMAIL OS
          </div>
        </header>

        {/* Center Content */}
        <div className="flex flex-1 items-center justify-center py-12">

          <div
            className="
              w-full
              max-w-xl
              border-[5px]
              border-black
              bg-white
              p-10
              shadow-[18px_18px_0px_0px_#000]
            "
          >
            {/* Badge */}
            <div className="mb-6 inline-block border-2 border-black px-3 py-1 text-xs font-black uppercase">
              Connect Once • Work Less
            </div>

            {/* Heading */}
            <h1 className="text-6xl font-black leading-[0.9]">
              Welcome
              <br />
              to Relay.
            </h1>

            <p className="mt-6 text-xl leading-relaxed">
              Your AI executive assistant for Gmail and Google Calendar.
              Read emails, draft replies, schedule meetings and manage your day
              from one workspace.
            </p>

            {/* CTA */}
            <button
              onClick={() =>
                authClient.signIn.social({
                  provider: "google",
                  callbackURL: "/dashboard",
                })
              }
              className="
                mt-10
                w-full
                border-4
                border-black
                bg-black
                px-8
                py-5
                text-xl
                font-black
                text-[#FFE600]
                transition
                hover:-translate-y-1
              "
            >
              CONTINUE WITH GOOGLE →
            </button>

            {/* Features */}
            <div className="mt-8 grid grid-cols-3 gap-3">
              <div className="border-2 border-black p-4 text-center">
                <div className="text-2xl">📧</div>
                <p className="mt-2 text-sm font-bold">
                  Gmail
                </p>
              </div>

              <div className="border-2 border-black p-4 text-center">
                <div className="text-2xl">📅</div>
                <p className="mt-2 text-sm font-bold">
                  Calendar
                </p>
              </div>

              <div className="border-2 border-black p-4 text-center">
                <div className="text-2xl">🤖</div>
                <p className="mt-2 text-sm font-bold">
                  AI Agent
                </p>
              </div>
            </div>

            {/* Bottom Text */}
            <div className="mt-8 border-t-2 border-black pt-6">
              <p className="text-center text-lg font-bold">
                Read. Reply. Schedule. Execute.
              </p>

              <p className="mt-2 text-center text-sm text-gray-600">
                Gmail • Google Calendar • AI Native
              </p>
            </div>

            {/* Terms */}
            <p className="mt-6 text-center text-xs text-gray-500">
              By continuing, you agree to connect your Google account with Relay.
            </p>
          </div>

        </div>

        {/* Footer */}
        <footer className="border-t-4 border-black pt-5">
          <p className="text-sm font-black uppercase">
            Relay • AI Executive Assistant
          </p>
        </footer>
      </div>
    </main>
  );
}