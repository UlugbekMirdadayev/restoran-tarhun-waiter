import React from 'react';
import { Link } from 'react-router-dom';
import { useRooms, useUser } from '../redux/selectors';

const Rooms = () => {
  const rooms = useRooms();
  const user = useUser();

  return (
    <div className="container-md">
      <div className="row-header">
        <h1 className="full">joylar royxati</h1>
      </div>
      <div className="grid">
        {[...rooms]
          ?.sort((a, b) => +a?.name - +b?.name)
          ?.map((room) => (
            <Link
              to={
                user?.role === 1
                  ? `/order/${room?.id}`
                  : room?.is_active
                  ? room?.is_belongs_to_user
                    ? `/order/${room?.id}`
                    : undefined
                  : `/order/${room?.id}`
              }
              key={room?.id}
              className={`room ${room?.is_active ? 'busy' : ''} ${
                user?.role === 1 ? '' : room?.is_active ? (room?.is_belongs_to_user ? '' : 'disabled') : ''
              }`}
            >
              <p>{room?.name}-stol</p>
              <p>{room?.places}-kishilik</p>
              {room?.is_active ? <p>band stol</p> : null}
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Rooms;
