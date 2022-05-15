import { Flex, Button } from "@chakra-ui/core";

const CustomButton = ({children, isLoading, onClick}) => (
  <Button
  	isLoading={isLoading}
  	height='50px'
  	variantColor='blue'
  	variant='outline'
  	backgroundColor='white'
  	mr={3}
  	onClick={onClick}
  >
  	{children}
  </Button>
);

export default function SignIn ({web3Loading, web3Provider, connectHandler, disconnectHandler, createAccountHandler, userExists, userLoading}) {
	return (
		<div>
	      <main>
	        <h1 className="title">Troth Me </h1>
        	<Flex h='100vh' justify='center' alignItems='center' bg='#e5f4f1'>
		        {web3Provider ? (
		          <CustomButton isLoading={userLoading} onClick={disconnectHandler}>
		            Disconnect
		          </CustomButton>
		        ) : (
		          <CustomButton isLoading={web3Loading} onClick={connectHandler}>
		            Connect Wallet
		          </CustomButton>
		        )}
		        { (!web3Provider || !userExists) &&
		          <CustomButton isLoading={web3Loading || userLoading} mr={3} onClick={createAccountHandler}> 
		        	Create Account
		          </CustomButton>
		        }
	        </Flex>
	      </main>
		</div>
	);
}