import { Flex, Button } from "@chakra-ui/core";

export default function SignIn ({web3Loading, web3Provider, connectHandler, disconnectHandler, userExists, userLoading}) {
	return (
		<div>
	      <main>
	        <h1 className="title">Troth Me </h1>
        	<Flex h='100vh' justify='center' alignItems='center' bg='#e5f4f1'>
		        {web3Provider ? (
		          <Button
		          	isLoading={userLoading}
		          	height='50px'
		          	variantColor='blue'
		          	variant='outline'
		          	backgroundColor='white'
		          	onClick={disconnectHandler}
		          >
		            Disconnect
		          </Button>
		        ) : (
		          <Button
		          	isLoading={web3Loading}
		          	height='50px'
		          	variantColor='blue'
		          	variant='outline'
		          	backgroundColor='white'
		          	onClick={connectHandler}
		          >
		            Connect Wallet
		          </Button>
		        )}
	        </Flex>
	      </main>
		</div>
	);
}