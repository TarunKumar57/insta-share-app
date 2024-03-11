import './index.css'

const ErrorView = props => {
  const {onTryAgain} = props
  return (
    <div className="error-container">
      <img
        src="https://res.cloudinary.com/dz881zzvx/image/upload/v1709359054/alert-triangle_tgl9pd.png"
        alt="error"
        className="error-img"
      />
      <p className="error-paragraph">Something went wrong. Please try again</p>
      <button type="button" onClick={onTryAgain} className="try-again-button">
        TryAgain
      </button>
    </div>
  )
}

export default ErrorView
