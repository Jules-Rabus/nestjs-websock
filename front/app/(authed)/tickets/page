"use client";

import { findAllTickets, Ticket } from "@/app/actions/tickets";
import TicketCard from "@/components/TicketCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TicketsList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const fetchTickets = async () => {
    const tickets = await findAllTickets();
    setTickets(tickets.data);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div>
      <Link href="/tickets/create">
        <Button onClick={fetchTickets}>
          <Plus />
          Ajouter un ticker
        </Button>
      </Link>
      <div className="grid grid-cols-4 gap-4 mt-4">
        <div className="space-y-4">
          <Badge variant="TODO">TODO</Badge>
          {tickets
            .filter((ticket) => ticket.status === "TODO")
            .map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
        </div>
        <div className="space-y-4">
          <Badge variant="IN_PROGRESS">IN_PROGRESS</Badge>
          {tickets
            .filter((ticket) => ticket.status === "IN_PROGRESS")
            .map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
        </div>
        <div className="space-y-4">
          <Badge variant="BLOCKED">BLOCKED</Badge>
          {tickets
            .filter((ticket) => ticket.status === "BLOCKED")
            .map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
        </div>
        <div className="space-y-4">
          <Badge variant="DONE">DONE</Badge>
          {tickets
            .filter((ticket) => ticket.status === "DONE")
            .map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
        </div>
      </div>
    </div>
  );
}
