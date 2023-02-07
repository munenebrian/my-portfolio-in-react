import React from "react";
import onlineBakery from "../assets/onlinebakery.png";
import installNode from "../assets/portfolio/installNode.jpg";
import weatherApp2 from "../assets/weatherapp2.png";
import weatherApp from "../assets/weatherapp.png";
import ecomerce from "../assets/ecomerce.png";
import reactWeather from "../assets/portfolio/reactWeather.jpg";

const Portfolio = () => {
  const portfolios = [
    {
      id: 1,
      src: onlineBakery,
    },
    {
      id: 2,
      src: weatherApp,
    },
    {
      id: 3,
      src: weatherApp2,
    },
    {
      id: 4,
      src: ecomerce,
    },
    {
      id: 5,
      src: installNode,
    },
    {
      id: 6,
      src: reactWeather,
    },
  ];

  return (
    <div
      name="portfolio" className="bg-gradient-to-b from-black to-gray-800 w-full text-white md:h-screen"
    >
      <div className="max-w-screen-lg p-4 mx-auto flex flex-col justify-center w-full h-full">
        <div className="pb-8">
          <p className="text-4xl font-bold inline border-b-4 border-gray-500">
            Portfolio
          </p>
          <p className="py-6">Check out some of my work right here.In order, i display projects i have worked on since i began my journey in software engineering.
          From my very first website created using just HTML, CSS and some bit of JavaScript, my second one was created as i practised on HTML,CSS and more onto Javascript.My third one was entirely done using JavaScript to have a clear understanding of the language. The forth one I engaged on it using ReactJS and Tailwind as i had just learned React as a JS library
          On to the final two projects, i managed to create fullstack applications using react for frontend and ruby on the backend side. I also used postgresql for the databases.</p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 px-12 sm:px-0">
          {portfolios.map(({ id, src }) => (
            <div key={id} className="shadow-md shadow-gray-600 rounded-lg">
              <img
                src={src} alt="" className="rounded-md duration-200 hover:scale-105"
              />
              <div className="flex items-center justify-center">
                <button className="w-1/2 px-6 py-3 m-4 duration-200 hover:scale-105">
                  Demo
                </button>
                <button className="w-1/2 px-6 py-3 m-4 duration-200 hover:scale-105">
                  Code
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
