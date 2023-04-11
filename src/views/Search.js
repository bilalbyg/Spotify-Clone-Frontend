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

  // const categories = [
  //   {
  //     categoryId: 1,
  //     categoryName: "Podcast'ler",
  //     categoryCoverUrl:
  //       "https://i.scdn.co/image/567158eb895ad26718a814345af0fc43ee785ec5",
  //     categoryBackgroundColor: "#27856a",
  //   },
  //   {
  //     categoryId: 2,
  //     categoryName: "Senin İçin Hazırlandı",
  //     categoryCoverUrl:
  //       "https://t.scdn.co/images/ea364e99656e46a096ea1df50f581efe",
  //     categoryBackgroundColor: "#1e3164",
  //   },
  //   {
  //     categoryId: 3,
  //     categoryName: "Listeler",
  //     categoryCoverUrl:
  //       "https://charts-images.scdn.co/assets/locale_en/regional/weekly/region_global_default.jpg",
  //     categoryBackgroundColor: "#8c67ab",
  //   },
  //   {
  //     categoryId: 4,
  //     categoryName: "Yeni Çıkanlar",
  //     categoryCoverUrl:
  //       "https://i.scdn.co/image/ab67706f000000027ea4d505212b9de1f72c5112",
  //     categoryBackgroundColor: "#e8105b",
  //   },
  //   {
  //     categoryId: 5,
  //     categoryName: "Keşfet",
  //     categoryCoverUrl:
  //       "https://t.scdn.co/images/d0fb2ab104dc4846bdc56d72b0b0d785.jpeg",
  //     categoryBackgroundColor: "#ba5d08",
  //   },
  //   {
  //     categoryId: 6,
  //     categoryName: "Podcast'ler",
  //     categoryCoverUrl:
  //       "https://i.scdn.co/image/567158eb895ad26718a814345af0fc43ee785ec5",
  //     categoryBackgroundColor: "#27856a",
  //   },
  //   {
  //     categoryId: 7,
  //     categoryName: "Senin İçin Hazırlandı",
  //     categoryCoverUrl:
  //       "https://t.scdn.co/images/ea364e99656e46a096ea1df50f581efe",
  //     categoryBackgroundColor: "#1e3164",
  //   },
  //   {
  //     categoryId: 8,
  //     categoryName: "Listeler",
  //     categoryCoverUrl:
  //       "https://charts-images.scdn.co/assets/locale_en/regional/weekly/region_global_default.jpg",
  //     categoryBackgroundColor: "#8c67ab",
  //   },
  //   {
  //     categoryId: 9,
  //     categoryName: "Yeni Çıkanlar",
  //     categoryCoverUrl:
  //       "https://i.scdn.co/image/ab67706f000000027ea4d505212b9de1f72c5112",
  //     categoryBackgroundColor: "#e8105b",
  //   },
  //   {
  //     categoryId: 10,
  //     categoryName: "Keşfet",
  //     categoryCoverUrl:
  //       "https://t.scdn.co/images/d0fb2ab104dc4846bdc56d72b0b0d785.jpeg",
  //     categoryBackgroundColor: "#ba5d08",
  //   },
  //   {
  //     categoryId: 11,
  //     categoryName: "Podcast'ler",
  //     categoryCoverUrl:
  //       "https://i.scdn.co/image/567158eb895ad26718a814345af0fc43ee785ec5",
  //     categoryBackgroundColor: "#27856a",
  //   },
  //   {
  //     categoryId: 12,
  //     categoryName: "Senin İçin Hazırlandı",
  //     categoryCoverUrl:
  //       "https://t.scdn.co/images/ea364e99656e46a096ea1df50f581efe",
  //     categoryBackgroundColor: "#1e3164",
  //   },
  //   {
  //     categoryId: 13,
  //     categoryName: "Listeler",
  //     categoryCoverUrl:
  //       "https://charts-images.scdn.co/assets/locale_en/regional/weekly/region_global_default.jpg",
  //     categoryBackgroundColor: "#8c67ab",
  //   },
  //   {
  //     categoryId: 14,
  //     categoryName: "Yeni Çıkanlar",
  //     categoryCoverUrl:
  //       "https://i.scdn.co/image/ab67706f000000027ea4d505212b9de1f72c5112",
  //     categoryBackgroundColor: "#e8105b",
  //   },
  //   {
  //     categoryId: 15,
  //     categoryName: "Keşfet",
  //     categoryCoverUrl:
  //       "https://t.scdn.co/images/d0fb2ab104dc4846bdc56d72b0b0d785.jpeg",
  //     categoryBackgroundColor: "#ba5d08",
  //   },
  //   {
  //     categoryId: 16,
  //     categoryName: "Podcast'ler",
  //     categoryCoverUrl:
  //       "https://i.scdn.co/image/567158eb895ad26718a814345af0fc43ee785ec5",
  //     categoryBackgroundColor: "#27856a",
  //   },
  //   {
  //     categoryId: 17,
  //     categoryName: "Senin İçin Hazırlandı",
  //     categoryCoverUrl:
  //       "https://t.scdn.co/images/ea364e99656e46a096ea1df50f581efe",
  //     categoryBackgroundColor: "#1e3164",
  //   },
  //   {
  //     categoryId: 18,
  //     categoryName: "Listeler",
  //     categoryCoverUrl:
  //       "https://charts-images.scdn.co/assets/locale_en/regional/weekly/region_global_default.jpg",
  //     categoryBackgroundColor: "#8c67ab",
  //   },
  //   {
  //     categoryId: 19,
  //     categoryName: "Yeni Çıkanlar",
  //     categoryCoverUrl:
  //       "https://i.scdn.co/image/ab67706f000000027ea4d505212b9de1f72c5112",
  //     categoryBackgroundColor: "#e8105b",
  //   },
  //   {
  //     categoryId: 20,
  //     categoryName: "Keşfet",
  //     categoryCoverUrl:
  //       "https://t.scdn.co/images/d0fb2ab104dc4846bdc56d72b0b0d785.jpeg",
  //     categoryBackgroundColor: "#ba5d08",
  //   },
  // ];

  const favoriteCategories = [
    {
      categoryId: 1,
      categoryName: "Metal",
      categoryCoverImageUrl:
        "https://lite-images-i.scdn.co/image/ab67706f0000000271380b17464611880efb0475",
      categoryBackgroundColor: "#79559f",
    },
    {
      categoryId: 2,
      categoryName: "Hip hop",
      categoryCoverImageUrl:
        "https://lite-images-i.scdn.co/image/ab67706f000000025e0500a373a3ac94424ef35f",
      categoryBackgroundColor: "#ba5d08",
    },
    {
      categoryId: 3,
      categoryName: "Rock",
      categoryCoverImageUrl:
        "https://lite-images-i.scdn.co/image/ab67706f00000002af7caab3c8334033d17ee673",
      categoryBackgroundColor: "#e51d32",
    },
    {
      categoryId: 4,
      categoryName: "Dans ve Elektronik",
      categoryCoverImageUrl:
        "https://i.scdn.co/image/ab67706f000000027ea4d505212b9de1f72c5112",
      categoryBackgroundColor: "#dc148b",
    },
  ];

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let categoryService = new CategoryService();
    categoryService.getCategories().then((result) => setCategories(result.data.data));
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
            {
            // favoriteCategories.map((category) => (
            categories.map((category) => (
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
        </div>
      </section>
    </>
  );
}
