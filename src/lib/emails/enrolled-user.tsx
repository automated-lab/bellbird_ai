import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
  render,
} from '@react-email/components';

interface Props {
  invitedUserEmail: string;
  productName: string;
  plan: string;
  temporaryPassword: string;
  appUrl: string;
}

export default function renderEnrollmentEmail(props: Props) {
  const previewText = `You've been invited to ${props.productName}`;

  return render(
    <Html>
      <Head />
      <Preview>{previewText}</Preview>

      <Tailwind>
        <Body className="bg-gray-50 my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded-lg my-[40px] mx-auto p-[20px] w-[465px] bg-white">
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Congratulation! , you&apos;ve been invited to{' '}
              <strong>{props.productName}</strong>!
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello {props.invitedUserEmail}, You have been granted a paid{' '}
              <strong>{props.plan}</strong> subscription to
              <strong>{props.productName}</strong>. We&apos;ve temporarily set
              up an account so you can access right away.
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              <strong>Email:</strong> {props.invitedUserEmail}
              <br />
              <strong>Temporary password:</strong> {props.temporaryPassword}
            </Text>

            <Section>
              <Row>
                <Column align="center">
                  <img
                    src="/assets/images/favicon/logo.png"
                    width={105}
                    height={36}
                    alt={props.productName}
                    className={`w-[95px] sm:w-[105px]`}
                  />
                </Column>
              </Row>
            </Section>

            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#000000] rounded text-white text-[12px] px-[20px] py-[12px] font-semibold no-underline text-center"
                href={props.appUrl}
              >
                Go to {props.productName}
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              or copy and paste this URL into your browser:{' '}
              <Link href={props.appUrl} className="text-blue-600 no-underline">
                {props.appUrl}
              </Link>
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              We suggest resetting your password once you first log in.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>,
  );
}
