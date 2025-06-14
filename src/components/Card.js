const Card = ({name, image, onClick}) => {
    return (
    <div className='card' onClick={onClick}>
        <img src={image} alt={name}/>
        <p>Digimon: {name}</p>
    </div>
    )
}

export default Card

// props from cardgrid passed down to be used to display info