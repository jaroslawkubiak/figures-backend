function createDate() {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    let hour = date.getHours();
    if (hour <=9) hour =`0${hour}`;
    let minute = date.getMinutes();
    if (minute <=9) minute =`0${minute}`;
    let sec = date.getSeconds();
    if (sec <=9) sec =`0${sec}`;
    return `${hour}:${minute}:${sec}, ${day}-${month}-${year}`;
}

module.exports = createDate;