import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

interface RatingInterface {
  value: number;
  text: string;
  color: string;
}

const Rating: React.FC<RatingInterface> = ({ value, text, color }) => {
    
    const renderStar = (index: number) => {
      if (value >= index) {
        return <FaStar style={{ color }} />;
      } else if (value >= index - 0.5) {
        return <FaStarHalfAlt style={{ color }} />;
      } else {
        return <FaRegStar style={{ color }} />;
      }
    };
  
    return (
      <div className="rating">
        {Array.from({ length: 5 }, (_, index) => (
          <span key={index}>{renderStar(index + 1)}</span>
        ))}
        <span>{text && text}</span>
      </div>
    );
  };
  
  export default Rating;