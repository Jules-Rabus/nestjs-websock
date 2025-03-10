"use client";

import { Ticket } from "@/app/actions/tickets";
import { User } from "@/app/actions/user";
import { formatDate } from "@/lib/date";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";

export default function TicketCard({ ticket }: { ticket: Ticket }) {
  const router = useRouter();

  const getUserAbreviation = (user: User) =>
    user ? `${user.firstName[0]}${user.lastName[0]}` : "";

  return (
    <Card
      key={ticket.id}
      className="p-6 hover:shadow-xl duration-300 cursor-pointer"
      onClick={() => router.push(`/tickets/${ticket.id}`)}
    >
      <CardTitle className="grid grid-cols-4 items-center">
        <div>{ticket.title}</div>
        <div className="col-start-3 col-span-2 flex justify-end items-center -space-x-2">
          {ticket.participants.map((participant, index) => (
            <Avatar
              className="w-8 h-8 drop-shadow"
              style={{
                zIndex: (ticket.participants.length - index) * 10,
              }}
            >
              <AvatarFallback>{getUserAbreviation(participant)}</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </CardTitle>
      <CardContent className="p-0">
        {ticket.filePath && (
          <Image
            src={`/api/media/${ticket.filePath}`}
            alt="image"
            width={100}
            height={100}
          />
        )}
        <Badge variant={ticket.status}>{ticket.status}</Badge>
        <div>{ticket.content}</div>
      </CardContent>
      <CardFooter className="grid grid-cols-4 items-center p-0">
        {formatDate(ticket.createdAt)}
        <div className="col-start-3 col-span-2 flex justify-end items-center -space-x-2">
          {ticket.reviewers.map((reviewer, index) => (
            <Avatar
              className="w-8 h-8 drop-shadow"
              style={{
                zIndex: (ticket.reviewers.length - index) * 10,
              }}
            >
              <AvatarFallback>{getUserAbreviation(reviewer)}</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
