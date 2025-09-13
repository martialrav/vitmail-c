import Link from 'next/link';
import { useTranslation } from "react-i18next";

const Item = ({ data, isLoading }) => {
  const { t } = useTranslation();
  return isLoading ? (
    <div className="h-6 mb-3 bg-gray-600 rounded animate-pulse" />
  ) : (
    <li>
      <Link href={data.path} className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-gray-700">
        {data.icon && <span className="text-lg">{data.icon}</span>}
        <span>{t(data.name)}</span>
      </Link>
    </li>
  );
};

Item.defaultProps = {
  data: null,
  isLoading: false,
};

export default Item;
