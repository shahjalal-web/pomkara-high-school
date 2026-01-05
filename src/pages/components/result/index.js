/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

const Result = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([])
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true)
      try {
        const response = await fetch("https://pomkara-high-school-server.vercel.app/getResult");
        if (!response.ok) {
          throw new Error("Failed to fetch Result");
        }
        const data = await response.json();
        setResult(data);
        //console.log(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, []);


  if (loading) {
    return (
      <div className="mt-5 text-center">
        <span className="loading loading-spinner text-primary"></span>
        <span className="loading loading-spinner text-secondary"></span>
        <span className="loading loading-spinner text-accent"></span>
        <span className="loading loading-spinner text-neutral"></span>
        <span className="loading loading-spinner text-info"></span>
        <span className="loading loading-spinner text-success"></span>
        <span className="loading loading-spinner text-warning"></span>
        <span className="loading loading-spinner text-error"></span>
      </div>
    );
  }

  if (result.length == 0) {
    return (
      <div className="text-center text-2xl font-serif uppercase mt-3 text-green-400">
        there are no results here for now
      </div>
    );
  }


  return (
    <div>
      <Head>
        <title>Results | Pomkara Siddikur Rahman & Hakim High School</title>
        <meta name="description" content="View the latest examination results and academic performance at Pomkara Siddikur Rahman & Hakim High School. Check your results and track academic progress here." />
        <meta name="keywords" content="results, Pomkara Siddikur Rahman & Hakim High School, examination results, academic performance, student results" />
        <meta property="og:title" content="Results - Pomkara Siddikur Rahman & Hakim High School" />
        <meta property="og:description" content="Check the latest examination results and academic performance at Pomkara Siddikur Rahman & Hakim High School. Stay updated with your academic progress." />
        <meta property="og:image" content="[URL to an image related to results or the school]" />
        <meta property="og:url" content="https://pomkara-high-school.netlify.app/components/result" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Results - Pomkara Siddikur Rahman & Hakim High School" />
        <meta name="twitter:description" content="Access your examination results and academic performance from Pomkara Siddikur Rahman & Hakim High School. Stay informed about your progress and achievements." />
        <meta name="twitter:image" content="[URL to an image related to results or the school]" />
      </Head>
      <div>
        <div>
        <div className="">
          {[...result]?.reverse().map((results) => (
            <>
              <div className="max-w-[800px] mx-auto shadow-xl bg-white text-center mt-5">
                <h2 className="md:text-4xl text-xl font-bold font-serif text-green-400 py-3">
                  {results.heading}
                </h2>
                <img
                  src={results.image}
                  className="mx-auto w-full px-10 rounded"
                />
                <div className="shadow-xl pb-2 bg-base-300 font-serif">
                  <p>Upload By : {results.uploader.name}</p>
                  <p>
                    Update Date:{" "}
                    {new Date(results.createdAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </>
          ))}
        </div>
        </div>
      </div>
    </div>
  )
}

export default Result