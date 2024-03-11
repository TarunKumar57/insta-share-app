import './index.css'

const FailureView = props => {
  const {onTryAgain} = props
  return (
    <div className="failure-container">
      <img
        src="https://res.cloudinary.com/dz881zzvx/image/upload/v1709282057/Group_7522_xngrhb.png"
        alt="failure view"
        className="failure-img"
      />
      <p className="failure-paragraph">
        Something went wrong. Please try again
      </p>
      <button type="button" onClick={onTryAgain} className="try-again-button">
        Try again
      </button>
    </div>
  )
}

export default FailureView
