import React, { useState, useEffect } from 'react'
import Hero from '../../Components/Hero/Hero'
import Features from '../../Components/Features/Features'
import FeatureProduct from '../../Components/FeatureProduct/FeatureProduct'
import FeaturePost from '../../Components/FeaturePost/FeaturePost'
import Newsletter from '../../Components/Newsletter/Newsletter'
import Testimonial from '../../Components/Testimonial/Testimonial'

const Home = () => {

    return (
        <div>
            <Hero />
            <Features />
            <FeatureProduct />
            <FeaturePost />
            <Testimonial />
            <Newsletter />
        </div>
    )
}

export default Home
