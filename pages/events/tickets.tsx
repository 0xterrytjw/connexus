import React, { Dispatch, SetStateAction, useEffect } from "react";
import { format, isValid } from "date-fns";
import TicketCard from "../../components/EventPages/TicketCard";

import { useSession } from "next-auth/react";
import useSWR from "swr";
import { Ticket, User } from "@prisma/client";
import { swrFetcher } from "../../lib/swrFetcher";
import { FaChevronLeft } from "react-icons/fa";
import Loading from "../../components/Loading";
import ProtectedRoute from "../../components/ProtectedRoute";
import Layout from "../../components/Layout";
import Link from "next/link";

const FanTicketsPage = () => {
  const { data: session, status } = useSession();
  // const userId = session?.user.userId;
  const userId = 4;

  const {
    data: userData,
    error,
    isLoading,
  } = useSWR(`http://localhost:3000/api/users/${userId}`, swrFetcher);
  //   const { tickets } = userData;

  if (isLoading) return <Loading />;
  console.log("user data ->", userData);
  const { tickets } = userData;
  return (
    <ProtectedRoute>
      <Layout>
        <main className="py-12 px-4 sm:px-12">
          {/* Header */}
          <nav className="flex items-center gap-6">
            <Link href="/events">
              <FaChevronLeft className="text-lg text-blue-600 hover:cursor-pointer sm:text-xl" />
            </Link>
            <h2 className="text-2xl font-bold sm:text-4xl">My Tickets</h2>
          </nav>
          <section>
            <div className="pt-6">
              {tickets.map((ticket: Ticket) => (
                <TicketCard key={ticket.ticketId} ticket={ticket} />
              ))}
            </div>
          </section>
        </main>
      </Layout>
    </ProtectedRoute>
  );
};

export default FanTicketsPage;
