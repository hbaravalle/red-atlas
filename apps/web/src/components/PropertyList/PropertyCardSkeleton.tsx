// Same structure as a property card, so the list keeps its layout while it
// loads. Each bone sits in the same <p> as the card, to match its height
export default function PropertyCardSkeleton() {
  return (
    <div className='card skeleton' aria-hidden='true'>
      <figure>
        <div className='bone image' />
      </figure>
      <div className='details'>
        <p className='title'>
          <span className='bone' style={{ width: '80%' }} />
        </p>
        <p className='address'>
          <span className='bone' style={{ width: '60%' }} />
        </p>
        <div className='numbers'>
          <p className='price'>
            <span className='bone' style={{ width: '5em' }} />
          </p>
          <p className='area'>
            <span className='bone' style={{ width: '4em' }} />
          </p>
        </div>
        <p className='createdAt'>
          <span className='bone' style={{ width: '45%' }} />
        </p>
      </div>
    </div>
  );
}
