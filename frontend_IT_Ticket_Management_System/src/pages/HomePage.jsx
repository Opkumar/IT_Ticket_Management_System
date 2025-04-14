import React from 'react';
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

function HomePage() {
   const plugin = React.useRef(
      Autoplay({ delay: 2000, stopOnInteraction: true })
    );

  return (
    <div className="min-h-[calc(100vh-76px)]">
         
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
    
  )
}

export default HomePage
