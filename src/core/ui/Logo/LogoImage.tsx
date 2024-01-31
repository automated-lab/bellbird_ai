import classNames from 'clsx';
import Image from 'next/image';

const LogoImage: React.FCC<{
  className?: string;
}> = ({ className }) => {
  return (
    <Image
      src="/assets/images/favicon/logo.png"
      width={105}
      height={36}
      alt="charm app"
      className={classNames(`w-[95px] sm:w-[105px]`)}
    />
  );
};

export default LogoImage;
