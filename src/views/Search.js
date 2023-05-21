import React, { useState, useRef, useEffect } from "react";
import Title from "../components/Title";
import ScrollContainer from "react-indiana-drag-scroll";
import { Icon } from "../Icons";
import Category from "../components/Category";
import SliderItem from "../components/SliderItem";
import CategoryService from "../services/categoryService";

export default function Search() {
  const favoritesRef = useRef();

  const [prev, setPrev] = useState(false);
  const [next, setNext] = useState(false);

  useEffect(() => {
    if (favoritesRef.current) {
      const scrollHandle = () => {
        const isEnd =
          favoritesRef.current.scrollLeft + favoritesRef.current.offsetWidth ===
          favoritesRef.current.scrollWidth;
        const isBegin = favoritesRef.current.scrollLeft === 0;
        setPrev(!isBegin);
        setNext(!isEnd);
      };

      scrollHandle();
      favoritesRef.current.addEventListener("scroll", scrollHandle);

      return () => {
        favoritesRef?.current?.removeEventListener("scroll", scrollHandle);
      };
    }
  }, [favoritesRef]);

  const slideNext = () => {
    favoritesRef.current.scrollLeft += favoritesRef.current.offsetWidth - 300;
  };
  const slidePrev = () => {
    favoritesRef.current.scrollLeft -= favoritesRef.current.offsetWidth - 300;
  };

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let categoryService = CategoryService.getInstance();
    categoryService
      .getCategories()
      .then((result) => setCategories(result.data.data));
  }, []);

  return (
    <>
      <section className="mb-8">
        <Title title="En çok dinlediğin türler" />

        <div className="relative">
          {prev && (
            <button
              className="w-12 absolute -left-6 hover:scale-[1.06] h-12 z-10 top-1/2 -translate-y-1/2 rounded-full bg-white text-black flex items-center justify-center"
              onClick={slidePrev}
            >
              <Icon name="back" size={24} />
            </button>
          )}
          {next && (
            <button
              className="w-12 absolute -right-6 hover:scale-[1.06] h-12 z-10 top-1/2 -translate-y-1/2 rounded-full bg-white text-black flex items-center justify-center"
              onClick={slideNext}
            >
              <Icon name="next" size={24} />
            </button>
          )}
          <ScrollContainer
            className="flex scrollable overflow-x gap-x-6"
            innerRef={favoritesRef}
          >
            <div
              style={{ background: "#e13300" }}
              className="rounded-lg relative w-[27.375rem] h-[13.75rem] flex-shrink-0"
            >
              <div className="absolute inset-0 overflow-hidden">
                <h3 className="p-4 text-[2.5rem] tracking-tighter font-semibold ">
                  Podcast'ler
                </h3>
                <img
                  className="shadow-spotify w-32 h-32 rotate-[25deg] translate-x-[18%] translate-y-[5%] absolute bottom-0 right-0"
                  src="https://i.scdn.co/image/ab6765630000ba8a2b41fc062049680d64487588"
                />
              </div>
            </div>

            {categories.map((category) => (
              <SliderItem key={category.categoryId} category={category} />
            ))}
          </ScrollContainer>
        </div>
      </section>
      <section>
        <Title title="Hepsine göz at" />

        <div className="grid grid-cols-5 gap-6">
          {categories.map((category) => (
            <Category key={category.categoryId} category={category} />
          ))}
          {categories.map((category) => (
            <Category key={category.categoryId} category={category} />
          ))}
          {categories.map((category) => (
            <Category key={category.categoryId} category={category} />
          ))}
          {categories.map((category) => (
            <Category key={category.categoryId} category={category} />
          ))}
          {categories.map((category) => (
            <Category key={category.categoryId} category={category} />
          ))}
        </div>
      </section>
    </>
  );
}
