"use client";
import { HomePageFilters } from "@/constants/filters";
import React, { useState } from "react";
import { Button } from "../ui/button";
type TagType = {
  _id: number;
  name: string;
};
type HomeFiltersProps = {
  _id: number;
  title: string;
  tags: TagType[];
  auther: string;
  upvotes: number;
  views: number;
  createdAt: string;
};

const HomeFilters = () => {
  const [active, setactive] = useState("newest");
  // const active = "newest";
  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((item) => (
        <Button
          key={item.value}
          onClick={() => setactive(item.value)}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${
            active === item.value
              ? "bg-primary-100 text-light-500"
              : "bg-light-800 text-light-500"
          }`}
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;
