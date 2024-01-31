import Image from 'next/image';
import classNames from 'classnames';

const LogoImageMini = () => {
  return (
    <Image
      src="/assets/images/favicon/logo.png"
      width={105}
      height={36}
      alt="charm app"
      className={classNames(`w-[70px] sm:w-[85px]`)}
    />
  );
};

export default LogoImageMini;
