import React, { useState } from "react";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

function Home() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I assist you today?" },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const generateBotResponse = (userText) => {
    const lowerCaseText = userText.toLowerCase();
    if (lowerCaseText.includes("hello")) {
      return "Hi there! What would you like to know?";
    } else if (lowerCaseText.includes("how are you")) {
      return "I'm just a bot, but I'm here to help you!";
    } else if (lowerCaseText.includes("printer issue")) {
      return "correct your wire \n and check power supply";
    } else {
      return "I'm not sure how to respond to that, but I'm learning!";
    }
  };

  const handleSend = () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { sender: "user", text: userInput }];
    setMessages(newMessages);
    setUserInput("");
    setIsTyping(true);

    // Bot response
    setTimeout(() => {
      const botReply = generateBotResponse(userInput);
      setMessages([...newMessages, { sender: "bot", text: botReply }]);
      setIsTyping(false);
    }, 1000);
  };

  // other line
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  return (
    <div className="min-h-[calc(100vh-76px)]">
      {/* <div className="relative z-10">
      
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600"
        >
          Chat
        </button>

        
        {isChatOpen && (
          <div className="fixed bottom-16 right-4 w-full max-w-md bg-gray-100 border border-gray-300 rounded-lg shadow-lg flex flex-col h-96">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`${
                    msg.sender === "bot" ? "self-start" : "self-end"
                  } max-w-xs p-3 rounded-lg ${
                    msg.sender === "bot"
                      ? "bg-gray-200 text-gray-800"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {isTyping && (
                <div className="self-start max-w-xs p-3 rounded-lg bg-gray-200 text-gray-800">
                  Typing...
                </div>
              )}
            </div>
            <div className="flex items-center p-4 bg-white border-t border-gray-200">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div> */}

      <div className=" block z-0">
        <Carousel
          className=" w-screen p-0 m-0 "
          plugins={[plugin.current]}
          loop={true}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="w-screen h-[450px] p-0 m-0">
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem className="w-full h-[450px]" key={index}>
                <div className="w-screen h-[450px]">
                  <Card className="w-full h-[450px]">
                    <CardContent className="flex aspect-square items-center justify-center w-screen p-0 m-0 h-[450px] ">
                      <span className="w-full h-full">
                        <img
                          className="w-screen h-[450px]"
                          src="https://cloudinary.hbs.edu/hbsit/image/upload/s--vP5-zAC6--/f_auto,c_fill,h_375,w_750,/v20200101/3F7024DDFB00A9115584AD2C4572F94E.jpg"
                        />
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      <div className=" mx-12 md:mx-48">
        <section className="m-2 md:flex py-12 md:py-24">
          <div className="hidden md:block">
            <h2 className="text-2xl lg:text-3xl text-center">
              IT Ticketing Management System{" "}
            </h2>
            <div className="flex  justify-center my-5">
              <img
                src="https://www.manageengine.com/products/service-desk/images/ticketing-system.webp"
                alt="image"
              />
            </div>
          </div>
          <h2 className="text-3xl text-center md:hidden">
            IT Ticketing Management System
          </h2>
          <div className="flex  justify-center my-5 md:hidden">
            <img
              src="https://www.manageengine.com/products/service-desk/images/ticketing-system.webp"
              alt="image"
            />
          </div>
          <p className="text-left md:w-[575px] mt-5 ml-5 text-[18px]">
            The IT Ticketing Management System is a streamlined solution
            designed to efficiently manage, track, and resolve IT issues,
            enhancing productivity and user experience across GD Goenka
            Education City.
          </p>
        </section>
        <section className="m-2 md:flex py-12 md:py-24">
          <div className="hidden md:block">
            <h2 className="text-2xl lg:text-3xl text-center">
              What is an IT ticketing Management system?
            </h2>
            <div className="flex  justify-center my-5">
              <img
                src="https://www.manageengine.com/products/service-desk/images/it-ticketing-system.webp"
                alt="image"
              />
            </div>
          </div>
          <h2 className="text-3xl text-center md:hidden">
            What is an IT ticketing Management system?
          </h2>
          <div className="flex  justify-center my-5 md:hidden">
            <img
              src="https://www.manageengine.com/products/service-desk/images/it-ticketing-system.webp"
              alt="image"
            />
          </div>
          <p className="text-left md:w-[575px] mt-5 ml-5 text-[18px]">
            The IT Ticketing Management System at GD Goenka Education City is a
            streamlined platform that allows users to efficiently log, track,
            and resolve IT issues. With automated workflows, ticket
            categorization, and real-time updates, it simplifies the management
            of IT service requests, ensuring faster resolutions and improving
            both team productivity and the overall user experience.
          </p>
        </section>
        <section className="m-2 md:flex py-12 md:py-24">
          <div className="hidden md:block">
            <h2 className="text-2xl lg:text-3xl text-center">
              What are the benefits of having an efficient IT ticketing system?
            </h2>
            <div className="flex  justify-center my-5">
              <img
                src="https://www.manageengine.com/products/service-desk/images/benefits-of-ticketing-system.webp"
                alt="image"
              />
            </div>
          </div>
          <h2 className="text-3xl text-center md:hidden">
            What are the benefits of having an efficient IT ticketing system?
          </h2>
          <div className="flex  justify-center my-5 md:hidden">
            <img
              src="https://www.manageengine.com/products/service-desk/images/benefits-of-ticketing-system.webp"
              alt="image"
            />
          </div>
          <div className="text-left md:w-[575px] mt-5 ml-5 text-[18px]">
            Here are seven benefits of implementing the IT Ticketing Management
            System at GD Goenka Education City:
            <ul className="grid  justify-center mt-5 list-disc ">
              <li>
                Makes IT support easily accessible with a user-friendly web and
                mobile platform.
              </li>
              <li>
                Ensures no tickets are overlooked by providing real-time
                tracking and automatic notifications.
              </li>
              <li>
                Reduces the IT team's workload by automating ticket
                categorization, prioritization, and task assignment.
              </li>
              <li>
                Centralizes ticket management for users to log, track, and
                resolve issues through a self-service portal.
              </li>
              <li>
                Promotes team collaboration by enabling IT staff to work
                together on a shared platform and leverage expertise.
              </li>
              <li>
                Increases IT team efficiency with a built-in knowledge base for
                both users and technicians.
              </li>
              <li>
                Provides performance insights through detailed reports and
                analytics to improve IT service delivery.
              </li>
            </ul>
          </div>
        </section>
        <section className="m-2 md:flex py-12 md:py-24">
          <div className="hidden md:block">
            <h2 className="text-2xl lg:text-3xl text-center">
              Enhancing the IT team's efficiency with a well-built knowledge
              base:
            </h2>
            <div className="flex  justify-center my-5">
              <img
                src="https://www.manageengine.com/products/service-desk/images/building-knowledge-base.webp"
                alt="image"
              />
            </div>
          </div>
          <h2 className="text-3xl text-center md:hidden">
            Enhancing the IT team's efficiency with a well-built knowledge base:
          </h2>
          <div className="flex  justify-center my-5 md:hidden">
            <img
              src="https://www.manageengine.com/products/service-desk/images/building-knowledge-base.webp"
              alt="image"
            />
          </div>
          <p className="text-left md:w-[575px] mt-5 ml-5 text-[18px]">
            A knowledge base in the IT Ticketing Management System offers
            technicians quick access to tried-and-tested solutions, saving time
            by avoiding repeated work on recurring issues. By making these
            articles available to end users in the self-service portal, it also
            helps reduce the IT team's workload, allowing users to find and
            resolve issues on their own.
          </p>
        </section>
        <section className="m-2 md:flex py-12 md:py-24">
          <div className="hidden md:block">
            <h2 className="text-2xl lg:text-3xl text-center">
              Offering end users a centralized platform:
            </h2>
            <div className="flex  justify-center my-5">
              <img
                src="https://www.manageengine.com/products/service-desk/images/maintain-a-knowledge-base.webp"
                alt="image"
              />
            </div>
          </div>
          <h2 className="text-3xl text-center md:hidden">
            Offering end users a centralized platform:
          </h2>
          <div className="flex  justify-center my-5 md:hidden">
            <img
              src="https://www.manageengine.com/products/service-desk/images/maintain-a-knowledge-base.webp"
              alt="image"
            />
          </div>
          <p className="text-left md:w-[575px] mt-5 ml-5 text-[18px]">
            The IT Ticketing Management System at GD Goenka Education City
            provides a dedicated self-service portal where users can easily log
            tickets, search the knowledge base for solutions, and track the
            progress of their requests. This centralized platform simplifies IT
            support, reducing the team's workload by allowing users to
            independently resolve common issues and stay updated on their ticket
            status.
          </p>
        </section>
      </div>
    </div>
  );
}

export default Home;
