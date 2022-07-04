import React, {memo, useEffect, useState } from "react";
import moment from "moment";
import "./calendar.css";
import { Modal, Form, Input, TimePicker } from "antd";
 



const WeekOfDays = () => {
    return (
      <div className="days">
        <div className="day">Sunday</div>
        <div className="day">Monday</div>
        <div className="day">Tuesday</div>
        <div className="day">Wednesday</div>
        <div className="day">Thurday</div>
        <div className="day">Friday</div>
        <div className="day">Saturday</div>
      </div>
    );
  };



const ModalForm = ({ show, onSave, onCancel, date }) => {
    const [form] = Form.useForm();
    const handleOk = async () => {
      try {
        const values = await form.validateFields();
        onSave(values);
        form.resetFields();
      } catch (error) {}
    };
    return (
      <Modal
        title="Add New Event"
        visible={show}
        okText="Save"
        onOk={handleOk}
        onCancel={onCancel}
      >
        <Form
          form={form}
          labelCol={{ span: 5 }}
          name="control-hooks"
          initialValues={{
            date,
          }}
        >
          <Form.Item name="date" label="Date">
            <Input disabled name="date" />
          </Form.Item>
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: "Please input the name of the event",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="start"
            label="Start Time"
            rules={[{ required: true, message: "Please provide a start time" }]}
          >
            <TimePicker />
          </Form.Item>
          <Form.Item
            name="end"
            label="End Time"
            rules={[{ required: true, message: "Please provide an end time" }]}
          >
            <TimePicker />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    );
};


const date_formate = "MM/DD/YYYY";

const GetDay = memo(({ date, currentMonth = true }) => {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
  
    const handleClick = () => {
      if (currentMonth) {
        setShowModal(true);
      }
    };
  
    const handleSave = (newEvent) => {
      const newEvents = [...events, newEvent];
      localStorage.setItem(date.format(date_formate), JSON.stringify(newEvents));
  
      setEvents(newEvents);
      setShowModal(false);
    };
  
    useEffect(() => {
      const events =
        JSON.parse(localStorage.getItem(date.format(date_formate))) ?? [];
  
      setEvents(events);
    }, [date]);
  
    return (
      <>
        <div
          className="date"
          style={{ color: currentMonth ? "black" : "#ccc" }}
          onClick={handleClick}
        >
          <p>{date.date()}</p>
          <div className="events">
            {events.map((event, index) => (
              <p className="event" key={index}>
                {event.name}
              </p>
            ))}
          </div>
        </div>
        <ModalForm
          show={showModal}
          date={date.format(date_formate)}
          onSave={handleSave}
          onCancel={() => setShowModal(false)}
        />
      </>
    );
});

const days_in_week = 7;

const Dates = ({ currentDate, startingDate }) => {
    const getDates = () => {
      if (currentDate === undefined || startingDate === undefined) {
        return [];
      }
  
      let daysInCalendar = currentDate.endOf("month").diff(startingDate, "days");
      daysInCalendar += days_in_week - (daysInCalendar % days_in_week);
  
      const dates = [];
      const date = startingDate.clone();
      for (let i = 0; i < daysInCalendar; i++) {
        dates.push(
          <GetDay
            key={date.dayOfYear()}
            date={date.clone()}
            currentMonth={date.month() === currentDate.month()}
          />
        );
  
        date.add(1, "day");
      }
  
      return dates;
    };
  
    return <div className="dates">{getDates()}</div>;
  };

const Calendar = () => {
  const [currentDate] = useState(moment());
  const [startingDate, setStartingDate] = useState();

  useEffect(() => {
    const date = moment().startOf("month");
    const day = date.day();

    setStartingDate(date.subtract(day, "days"));
  }, []);

  return (
    <div className="calendar">
      <h2>{currentDate.format("MMMM")}</h2>

      <WeekOfDays />
      <Dates currentDate={currentDate} startingDate={startingDate} />
    </div>
  );
};

export default Calendar;

