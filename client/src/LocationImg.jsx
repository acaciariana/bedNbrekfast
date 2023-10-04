/* eslint-disable react/prop-types */
export default function LocationImg({location,index=0,className=null}) {
    if(!location.photos?.length){
        return '';
    }
    if(!className) {
        className = 'object-cover'
    }
    return(
        <img className="className" src={'http://localhost:4000/uploads/' + location.photos[index]} alt=""/>
    )
}