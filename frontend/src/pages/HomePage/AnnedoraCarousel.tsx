import { Carousel, Container, Image } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const AnnedoraCarousel:React.FC = () => {

  const { t } = useTranslation("home")

  return (
    <Container>
      <h1 className="mx-1 mb-5">{t("carouselTitle")}</h1>

      <Carousel pause='hover' variant='dark' fade className='mt-3'>
        
        <Carousel.Item key='frames' className='d-flex justify-content-center align-items-center pb-5'>
          <Image src='https://res.cloudinary.com/drr5veysu/image/upload/v1686780076/media/images/frames_s4vnj9.jpg' style={{  height: "500px" }} />
        </Carousel.Item>

        <Carousel.Item key='bee-hand' className='d-flex justify-content-center align-items-center pb-5'>
          <Image src='https://res.cloudinary.com/drr5veysu/image/upload/v1686780076/media/images/bee_fgo5af.jpg' style={{ height: "500px" }} />
        </Carousel.Item>

        <Carousel.Item key='dodo_vali' className='d-flex justify-content-center align-items-center pb-5'>
          <Image src='https://res.cloudinary.com/drr5veysu/image/upload/v1686780076/media/images/dodo_vali_gxdyei.jpg' style={{ height: "500px" }} />
        </Carousel.Item>

        <Carousel.Item key='honey' className='d-flex justify-content-center align-items-center pb-5'>
          <Image src='https://res.cloudinary.com/drr5veysu/image/upload/v1686780076/media/images/honey_w9nyyd.jpg' style={{ height: "500px" }} />
        </Carousel.Item>

        <Carousel.Item key='family' className='d-flex justify-content-center align-items-center pb-5'>
          <Image src='https://res.cloudinary.com/drr5veysu/image/upload/v1686780076/media/images/family_m1bov4.jpg' style={{ height: "500px" }} />
        </Carousel.Item>

        <Carousel.Item key='products' className='d-flex justify-content-center align-items-center pb-5'>
          <Image src='https://res.cloudinary.com/drr5veysu/image/upload/v1686780076/media/images/products_hllpcu.jpg' style={{ height: "500px" }} />
        </Carousel.Item>

      </Carousel>
    </Container>

    
  )       
}

export default AnnedoraCarousel