import React from "react";

const About = () => {
  return (
    <div name="about" className="w-full h-screen bg-gradient-to-b from-gray-800 to-black text-white">
      <div className="max-w-screen-lg p-4 mx-auto flex flex-col justify-center w-full h-full">
        <div className="pb-8">
          <p className="text-4xl font-bold inline border-b-4 border-gray-500">
            About
          </p>
        </div>

        <p className="text-xl mt-20">
          Brian is aspiring to be a SWE and take part in the technological world in a big way. 
          I developed this passion in my school levels and joined campus as an undergrad student in the 
          Jomo Kenyetta University of Agriculture and Technology. 
          I'm pursuing a bachelor's degree in Mathematics and Computer Science and still undergoing a SWE bootcamp at Moringa School.
          I have developed my technical skills through these two institutions, a lot of youtube videos and online courses.
          To add on, i have developed my soft skills through online platforms like linkedin.
          I'm ready to put my knowledge to practical use in job field, ready to learn and get better each day. 
        </p>

        <br />

        <p className="text-xl">
          I have been practising coding for less than a year now but i'm marvelled each and everyday at what power my machine has as i write every line of code.
          The challenges that come with bugs, thrill me every time and make me want to know more and get better each day.
          Those preceeding me always encourage me especially with their work positions and what they are doing to make our world a better place through tech. This, this is what keeps me going, this is what i want to be.
        </p>
      </div>
    </div>
  );
};

export default About;