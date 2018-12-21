import React from "react";
import dateFns from "date-fns";

import API from '../API'
import ReactLoading from 'react-loading';

class Calendar extends React.Component {
 
    state = {
      currentMonth: new Date(),
      reservedDates: [],
      isLoading: true,
    }
  
  componentDidMount() {
    this.getDatesFromServer(this.state.currentMonth)
  }

  getDatesFromServer(currentMonth) {

    const dateFormat = "YYYY-M-D"
    const monthStart = dateFns.format(dateFns.startOfMonth(currentMonth), dateFormat)
    const monthEnd = dateFns.format(dateFns.endOfMonth(monthStart), dateFormat)
    
    API.getReservedDates(monthStart, monthEnd)
      .then(dates => {
        this.setState({ reservedDates: dates.payload })
      }).then(this.setState({ isLoading: false }))
  }

  renderHeader() {

    const dateFormat = "MMMM YYYY";

    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={this.prevMonth}>
            chevron_left
          </div>
        </div>
        <div className="col col-center">
          <span>{dateFns.format(this.state.currentMonth, dateFormat)}</span>
        </div>
        <div className="col col-end" onClick={this.nextMonth}>
          <div className="icon">chevron_right</div>
        </div>
      </div>
    );
  }

  renderDays() {
    const dateFormat = "dddd";
    const days = [];

    let startDate = dateFns.startOfWeek(this.state.currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className="days row">{days}</div>;
  }

  renderCells() {
    const { currentMonth, reservedDates } = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart); 
    const endDate = dateFns.endOfWeek(monthEnd);
 
    const dateFormat = "D";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {

      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, dateFormat);
        const cloneDay = day;
        days.push(
          <div
            key={day}
            className={`col cell
              
              ${!dateFns.isSameMonth(day, monthStart) || dateFns.isSunday(day) ? "disabled" : ""}
              ${reservedDates.map(date => dateFns.isSameDay(cloneDay, date) ? " booked " : "") }
              
              `} 
            onClick={() => this.onDateClick(cloneDay)}
          >
            <span className="number">{formattedDate}</span>
            <span className="bg">{formattedDate}</span>
          </div>
        );
        day = dateFns.addDays(day, 1);
      }

      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];

    }
    return <div className="body">{rows}</div>;
  }

  onDateClick = day => {

    const iosDate = dateFns.format(day, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
    const {reservedDates} = this.state
    const dateFormat = "YYYY-M-D"
    const formattedDate = dateFns.format(day, dateFormat)
    const boolean = reservedDates.find(date => dateFns.isSameDay(day, date))

    if (boolean) {
      this.setState({ isLoading: true })
      API.changeReservedDate(formattedDate, false)
        .then(resp => {
          resp && this.setState({ isLoading: false })
          if (resp.status === 500) {
            alert("Server error, please try again")
          }
        })

      const newReservedDates = reservedDates.filter(dates => dates !== iosDate)
      this.setState({ reservedDates: newReservedDates })

    } else {
      this.setState({ isLoading: true })
      API.changeReservedDate(formattedDate, true)
        .then(resp => {
          resp && this.setState({ isLoading: false })
          if (resp.status === 500) {
            alert("Server error, please try again")
          }
        })

      const newReservedDates = [...reservedDates, iosDate]
      this.setState({ reservedDates: newReservedDates })
    }

  };

  prevMonth = () => {
    this.setState({
      currentMonth: dateFns.subMonths(this.state.currentMonth, 1),
      reservedDates: [],
    });
    this.getDatesFromServer(dateFns.subMonths(this.state.currentMonth, 1))
  };

  nextMonth = () => {
    this.setState({
      currentMonth: dateFns.addMonths(this.state.currentMonth, 1),
      reservedDates: [],
    });
    this.getDatesFromServer(dateFns.addMonths(this.state.currentMonth, 1))
  };

  render() {

    console.log("CURRENT MONTH:", this.state.currentMonth)
    console.log("RESERVED DATES", this.state.reservedDates)

    return (
      <div className="calendar">
      {
        this.state.isLoading ? 
        <ReactLoading type={'spin'} color={'green'} height={75} width={75} className='loadingEl' />
        :
        <div>
          {this.renderHeader()}
          {this.renderDays()}
          {this.renderCells()}
        </div>
      }
      
      </div>
    );
  }
}

export default Calendar;