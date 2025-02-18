import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ItemSkeleton = () => (
  <div className="flex items-center gap-3 p-2 animate-pulse">
    <Skeleton
      baseColor="#151515"
      highlightColor="#f5f5f5"
      duration={0.5}
      circle
      height={50}
      width={50}
    />
    <div>
      <Skeleton
        baseColor="#151515"
        highlightColor="#f5f5f5"
        duration={0.5}
        width={200}
        height={12}
      />
      <Skeleton
        baseColor="#151515"
        highlightColor="#f5f5f5"
        duration={0.5}
        width={150}
        height={10}
        style={{ marginTop: 5 }}
      />
    </div>
  </div>
);

export default ItemSkeleton;
