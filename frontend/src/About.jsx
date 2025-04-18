import React from "react";

const About = () => {
  return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-10">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0f172a] mb-8 border-b pb-4">
            🚀 About This Project
          </h1>

          <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
            <h1 className="text-4xl font-extrabold text-blue-600 mb-6">О проекте</h1>

            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Этот сервис помогает соискателям и работодателям легко находить друг друга с помощью анализа резюме и
              вакансий.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Мы используем искусственный интеллект, чтобы находить лучшие совпадения между навыками и требованиями.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed">
              Проект основан на Django и React, что делает его быстрым, безопасным и удобным.
            </p>

          </div>
        </div>
      </div>
  );
};

export default About;
