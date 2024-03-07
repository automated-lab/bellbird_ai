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
import configuration from '~/configuration';

interface Props {
  invitedUserEmail: string;
  productName: string;
  plan: string;
  appUrl: string;
}

export default function renderExistingUserEnrolledEmail(props: Props) {
  const previewText = `You've been invited to ${props.productName}`;

  return render(
    <Html>
      <Head />
      <Preview>{previewText}</Preview>

      <Tailwind>
        <Body className="mx-auto my-auto font-sans bg-gray-50">
          <Container className="border border-solid border-[#eaeaea] rounded-lg my-[40px] mx-auto p-[20px] w-[465px] bg-white">
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Welcome to <strong>{props.productName}</strong>!
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello {props.invitedUserEmail}, You have been granted a paid{' '}
              <strong>{props.plan}</strong> subscription to{' '}
              <strong>{props.productName}</strong>. You can now access the
              platform with your existing account.
            </Text>

            <Section>
              <Row>
                <Column align="center">
                  <Img
                    src={`${configuration.site.siteUrl}/assets/images/favicon/logo.png`}
                    width="64"
                    height="64"
                    alt={props.productName}
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
              If you have any questions or need assistance, please don&apos;t
              hesitate to reach out to our support team.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>,
  );
}
