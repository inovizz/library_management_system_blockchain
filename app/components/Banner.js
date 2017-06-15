import React from 'react'
import BannerImage from '../img/Triad-01.png'

const Banner = () => (
  <div className='row yogalogo'>
    <div className='col-sm-6'>
      <div className='yoga-wrapper'>
        <img width = '1016'
        height = '590'
        src = {BannerImage}
        className = 'vc_single_image-img attachment-large'
        alt = ''
        sizes = '(max-width: 1016px) 100vw, 1016px' />
      </div>
    </div>
    <div className='col-sm-6'>
      <div className='yoga-header'>
        <h1>Yoga for the mind</h1>
      </div>
      <div className='yoga-subheader'>
        <h4>Get Rewarded for Reading</h4>
      </div>
    </div>
  </div>
)

export default Banner
