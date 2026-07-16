import SearchBar from './search-bar';

interface HostawayCalendarProps {
  className?: string;
  listingId?: number;
}

export default function HostawayCalendar({ className = '', listingId = 40467 }: HostawayCalendarProps) {
  return (
    <div className={`${className}`}>
      <SearchBar variant="calendar" listingId={listingId} />
    </div>
  );
}