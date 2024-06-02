import React from 'react';
import { Link } from 'react-router-dom';
import { useRooms } from '../redux/selectors';
import { groupRoomsByType } from 'utils';

const Prerooms = () => {
  const rooms = useRooms();

  return (
    <div className="container-md">
      <div className="row-header">
        <h1 className="full">Joylar tulari</h1>
      </div>
      <div className="grid">
        {[...groupRoomsByType(rooms)]?.map((room) => (
          <Link to={`/rooms?room_type=${room?.room_type}`} key={room?.room_type} className={`room`}>
            <p>{room?.room_type}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Prerooms;
