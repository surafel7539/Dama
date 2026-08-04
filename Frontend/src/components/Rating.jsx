import React,{useState} from "react";
import {Star} from "lucide-react";


export default function Rating({onSubmit}){

    const [rating,setRating]=useState(0);


    return (

        <div>

            <h3 className="font-bold mb-2">
            Rate this product
            </h3>


            <div className="flex gap-2">

                {
                [1,2,3,4,5].map((star)=>(

                <Star
                key={star}
                size={30}
                onClick={()=>setRating(star)}
                className={
                star<=rating
                ?
                "text-yellow-500 fill-yellow-500 cursor-pointer"
                :
                "text-gray-400 cursor-pointer"
                }
                />

                ))
                }

            </div>


            <button

            onClick={()=>onSubmit(rating)}

            className="mt-4 bg-[#c29b57] px-5 py-2 rounded-lg"

            >
            Submit
            </button>


        </div>

    )

}