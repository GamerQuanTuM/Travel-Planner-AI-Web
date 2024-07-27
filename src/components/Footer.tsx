import React from 'react';
import { FaGithub, FaLinkedin, FaInstagram, FaFacebook } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-200 py-4 h-40">
      <div className="container mx-auto text-center flex flex-col items-center justify-center h-full">
        <h1 className="text-xl font-normal mb-4">
          Crafted with passion and ❤️ by Shuvam Santra. Thank you for visiting! 🌟🚀
        </h1>
        <div className="flex space-x-4 gap-3">
          <a
            href="https://github.com/GamerQuanTuM"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-200"
          >
            <FaGithub size={30} />
          </a>
          <a
            href="https://www.linkedin.com/in/shuvam-santra10/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-200"
          >
            <FaLinkedin size={30} />
          </a>
          <a
            href="https://www.instagram.com/ig_quantum2op/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-200"
          >
            <FaInstagram size={30} />
          </a>
          <a
            href="https://www.facebook.com/shuvamsantra10/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-200"
          >
            <FaFacebook size={30} />
          </a>
        </div>
      </div>
    </footer>
  );
}
