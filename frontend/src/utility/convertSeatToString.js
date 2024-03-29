const convertSeatToString = (seat) => {
    // console.log(seat)
    const rowLabel = String.fromCharCode('A'.charCodeAt(0) + seat.rowIndex);
    const seatLabel = seat.seatIndex + 1; // Adding 1 to convert from 0-based index to 1-based seat number
    return `${rowLabel}${seatLabel}`;
}

export default convertSeatToString;