import { Carousel, Image } from 'react-bootstrap'

function AnnedoraCarousel() {

  return (
    <Carousel pause='hover' variant='dark' fade>
        
      <Carousel.Item key='frames'>
        <Image src='https://res.cloudinary.com/drr5veysu/image/upload/v1686780076/media/images/frames_s4vnj9.jpg' fluid style={{  height: "600px",  }} />
      </Carousel.Item>

      <Carousel.Item key='bee-hand'>
        <Image src='https://res.cloudinary.com/drr5veysu/image/upload/v1686780076/media/images/bee_fgo5af.jpg' fluid style={{ height: "600px", objectFit: "cover" }} />
      </Carousel.Item>

      <Carousel.Item key='dodo_vali'>
        <Image src='https://res.cloudinary.com/drr5veysu/image/upload/v1686780076/media/images/dodo_vali_gxdyei.jpg' fluid style={{ height: "600px", objectFit: "cover" }} />
      </Carousel.Item>

      <Carousel.Item key='honey'>
        <Image src='https://res.cloudinary.com/drr5veysu/image/upload/v1686780076/media/images/honey_w9nyyd.jpg' fluid style={{ height: "600px", objectFit: "cover" }} />
      </Carousel.Item>

      <Carousel.Item key='family'>
        <Image src='https://res.cloudinary.com/drr5veysu/image/upload/v1686780076/media/images/family_m1bov4.jpg' fluid style={{ height: "600px", objectFit: "cover" }} />
      </Carousel.Item>

      <Carousel.Item key='products'>
        <Image src='https://res.cloudinary.com/drr5veysu/image/upload/v1686780076/media/images/products_hllpcu.jpg' fluid style={{ height: "600px", objectFit: "cover" }} />
      </Carousel.Item>

    </Carousel>
  )       
}

export default AnnedoraCarousel