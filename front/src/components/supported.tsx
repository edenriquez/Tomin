export default function SupportedBrands(){
    return(
        <div className="relative w-full overflow-hidden mb-10 -mt-8">
          <div className="flex justify-center gap-4">
             {/* eslint-disable @next/next/no-img-element */}
             <img
                src={`/carousel-${1}.png`}
                alt={`Carousel image ${1}`}
                className="h-[100px] w-64 object-cover rounded-lg shadow-lg grayscale hover:grayscale-0 transition-all duration-300"
              />
             {/* eslint-disable @next/next/no-img-element */}
             <img
                src={`/carousel-${2}.png`}
                alt={`Carousel image ${2}`}
                className="h-[100px] object-cover rounded-lg shadow-lg grayscale hover:grayscale-0 transition-all duration-300"
              />
             {/* eslint-disable @next/next/no-img-element */}
             <img
                src={`/carousel-${3}.png`}
                alt={`Carousel image ${3}`}
                className="h-[100px] w-64 object-cover rounded-lg shadow-lg grayscale hover:grayscale-0 transition-all duration-300"
              />
          </div>
        </div>
    )
}