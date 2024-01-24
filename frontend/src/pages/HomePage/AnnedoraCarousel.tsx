import { Carousel, Image } from 'react-bootstrap'

const AnnedoraCarousel:React.FC = () => {

  return (
    <Carousel pause='hover' variant='dark' fade className='mt-3'>
        
      <Carousel.Item key='frames' className='d-flex justify-content-center align-items-center pb-5'>
        <Image src='https://res.cloudinary.com/drr5veysu/image/upload/v1686780076/media/images/frames_s4vnj9.jpg' fluid  style={{  height: "500px" }} />
      </Carousel.Item>

      <Carousel.Item key='bee-hand' className='d-flex justify-content-center align-items-center pb-5'>
        <Image src='https://res.cloudinary.com/drr5veysu/image/upload/v1686780076/media/images/bee_fgo5af.jpg' fluid style={{ height: "500px", objectFit: "cover" }} />
      </Carousel.Item>

      <Carousel.Item key='dodo_vali' className='d-flex justify-content-center align-items-center pb-5'>
        <Image src='https://res.cloudinary.com/drr5veysu/image/upload/v1686780076/media/images/dodo_vali_gxdyei.jpg' fluid style={{ height: "500px", objectFit: "cover" }} />
      </Carousel.Item>

      <Carousel.Item key='honey' className='d-flex justify-content-center align-items-center pb-5'>
        <Image src='https://res.cloudinary.com/drr5veysu/image/upload/v1686780076/media/images/honey_w9nyyd.jpg' fluid style={{ height: "500px", objectFit: "cover" }} />
      </Carousel.Item>

      <Carousel.Item key='family' className='d-flex justify-content-center align-items-center pb-5'>
        <Image src='https://res.cloudinary.com/drr5veysu/image/upload/v1686780076/media/images/family_m1bov4.jpg' fluid style={{ height: "500px", objectFit: "cover" }} />
      </Carousel.Item>

      <Carousel.Item key='products' className='d-flex justify-content-center align-items-center pb-5'>
        <Image src='https://res.cloudinary.com/drr5veysu/image/upload/v1686780076/media/images/products_hllpcu.jpg' fluid style={{ height: "500px", objectFit: "cover" }} />
      </Carousel.Item>

    </Carousel>
  )       
}

export default AnnedoraCarousel