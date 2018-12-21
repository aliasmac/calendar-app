class API {

    static getReservedDates(start, end) {
        return fetch(`http://localhost:3000/reserved/${start}/${end}`)
          .then(resp => resp.json())
            // .catch(err => console.log("ERRRRR", err))
    }

    static changeReservedDate(date, boolean) {
        return fetch(`http://localhost:3000/reserved/${date}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                reserved: boolean,
            })
        })
        
    }

}

export default API

