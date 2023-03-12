import type { NextPage } from "next";
import Head from "next/head";
import { FaGithub, FaShareSquare } from "react-icons/fa";
import Button from "../components/Button";
import Badge from "../components/Badge";
import { useEffect, useState } from "react";
import Notification from "../components/Notification";
import "@biconomy/web3-auth/dist/src/style.css";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import StripeCheckoutForm from "../components/Stripe/StripeCheckoutForm";

const HomePage: NextPage = () => {
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [selected, setSelected] = useState(false);

  const { data: session, status } = useSession();

  const SocialLoginDynamic = dynamic(
    () => import("../components/scw").then((res) => res.default),
    {
      ssr: false,
      loading: () => <Loading className="!h-full" />,
    }
  );

  return (
    <div>
      <Head>
        <title>Home | Connexus</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center p-10 tracking-widest">
        <h1 className="animate-pulse text-3xl font-bold">Let's build. 🚀</h1>

        <h2 className="mt-10 mb-6 text-xl font-semibold">Authentication</h2>

        <section className="mb-8 flex flex-wrap gap-4">
          <Button
            variant="solid"
            size="md"
            className="mt-4"
            onClick={
              session
                ? () => router.push("/communities")
                : () => setIsAuthModalOpen(true)
            }
          >
            Login
          </Button>
          <Modal isOpen={isAuthModalOpen} setIsOpen={setIsAuthModalOpen}>
            <SocialLoginDynamic isAuthModalOpen={isAuthModalOpen} />
          </Modal>
        </section>

        <div className="divider" />
        <h2 className="mt-10 mb-6 text-xl font-semibold">Stripe payments</h2>
        <section className="">
          <StripeCheckoutForm
            priceId="price_1MkhJ5CmKD4DhrYcwR3xsNCA"
            creatorId={1}
          />
        </section>

        <div className="divider" />

        <h2 className="mt-10 mb-6 text-xl font-semibold">
          Components showcase
        </h2>

        <div className="divider" />

        <h3 className="font-bold">Buttons</h3>
        <section className="mb-8 flex flex-wrap gap-4">
          <Button variant="solid" size="md" className="mt-4">
            <FaGithub />
            Github repo
          </Button>
          <Button variant="solid" size="md" className="mt-4">
            Github repo
          </Button>
          <Button variant="outlined" size="md" className="mt-4">
            <FaGithub />
            Github repo
          </Button>
          <Button variant="outlined" size="md" className="mt-4">
            Github repo
          </Button>
        </section>
        <section className="flex gap-4">
          <Button variant="solid" size="md" className="rounded-full">
            <FaShareSquare />
          </Button>
          <Button variant="outlined" size="md" className="rounded-full">
            <FaShareSquare />
          </Button>
        </section>
        <div className="divider" />
        <h3 className="font-bold">Badges</h3>
        <section className="mt-4 flex flex-wrap items-center gap-4">
          <Badge size="lg" label="NFT" />
          <Badge
            size="lg"
            label="Entertainment"
            selected={selected}
            onClick={() => {
              setSelected(!selected);
            }}
          />
        </section>
        <div className="divider" />
        <h3 className="font-bold">Notifications</h3>
        <section className="mt-4 flex w-full flex-col flex-wrap">
          <Notification
            userId="1"
            userProfilePic=""
            userName="Fan name"
            message="has sent you a message! Let's chat!"
            linkLabel="Go to chat room #1"
            href="chats"
          />
          <div className="card border-2 border-gray-200 bg-white">
            <ul role="list" className="divide-y divide-gray-200">
              <li>
                <Notification
                  userId="1"
                  userProfilePic=""
                  userName="Creator name #1"
                  message="has rejected your chat request."
                />
              </li>
              <li>
                <Notification
                  message="Please be reminded that event will start in 2 days!"
                  linkLabel="Go to event details"
                  href="events"
                />
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
