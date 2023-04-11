function SliderItem({ category }) {
    return (
      <div
        style={{ background: category.categoryBackgroundColor }}
        className="rounded-lg relative w-[27.375rem] h-[13.75rem] flex-shrink-0"
      >
        <div className="absolute inset-0 overflow-hidden">
          <h3 className="p-4 text-[2.5rem] tracking-tighter font-semibold ">
            {category.categoryName}
          </h3>
          <img
            className="shadow-spotify w-32 h-32 rotate-[25deg] translate-x-[18%] translate-y-[5%] absolute bottom-0 right-0"
            src={category.categoryCoverImageUrl}
          />
        </div>
      </div>
    );
  }

  export default SliderItem;