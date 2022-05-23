import {
	Flex,
	Button,
	Text,
	Grid,
	Box
} from "@chakra-ui/core";

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

export default function SignIn ({userDisplayMessage, web3DisplayMessage, web3Loading, web3Provider, connectHandler, disconnectHandler, createUserHandler, userExists, userLoading}) {
	return (
		<div>
				<Flex h='5vh' justify='center' alignItems='center'>
	        <b>HighFy Me </b>
	      </Flex>
	      <main>
	        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
	        	<Box w="100%" bg='#e5f4f1'>
			        <Flex justify='center' alignItems='center'>
			        	<b>Walkthrough Videos</b>
			        </Flex>	    
			        <Flex justify='center' alignItems='center'>
			        	1. Claim your inbox in less than 2 mins!
			        </Flex>
			        <Flex justify='center' alignItems='center'>
			        	<iframe width="420" height="315" src="https://www.youtube.com/embed/NokLvVyfylI"></iframe>
			        </Flex>
			        <Flex h='2vh' justify='center' alignItems='center'>
			        </Flex>
			        <Flex justify='center' alignItems='center'>
			        	2. Sending A Message to another Address
			        </Flex>
			        <Flex justify='center' alignItems='center'>
			        	<iframe width="420" height="315" src="https://www.youtube.com/embed/iLrKfVtC-lU"></iframe>
			        </Flex>
			        <Flex h='2vh' justify='center' alignItems='center'>
			        </Flex>
			        <Flex justify='center' alignItems='center'>
			        	3. Responding To a Message and Earn
			        </Flex>
			        <Flex justify='center' alignItems='center'>
			        	<iframe width="420" height="315" src="https://www.youtube.com/embed/b6vhCSS8C9Q"></iframe>
			        </Flex>
			        <Flex h='2vh' justify='center' alignItems='center'>
			        </Flex>
			        <Flex justify='center' alignItems='center'>
			        	4. Whitelist Users & Dapps!
			        </Flex>
			        <Flex justify='center' alignItems='center'>
			        	<iframe width="420" height="315" src="https://www.youtube.com/embed/rj3HkjvEyW8"></iframe>
			        </Flex>
			        <Flex h='2vh' justify='center' alignItems='center'>
			        </Flex>
			      </Box>
	        	<Box w="100%" bg='#e5f4f1'>
			        <Flex h='35vh' justify='center' alignItems='center'></Flex>
			        <Flex h='5vh' justify='center' alignItems='center'>
			        { !web3Provider ? (
			        		<Text>{web3DisplayMessage}</Text>
			        	) : (
			        		<Text>{userDisplayMessage}</Text>
			        	)
			        }
			        </Flex>
		        	<Flex h='15vh' justify='center' alignItems='center'>
				        {web3Provider ? (
				          <CustomButton isLoading={userLoading} onClick={disconnectHandler}>
				            Disconnect
				          </CustomButton>
				        ) : (
				          <CustomButton isLoading={web3Loading} onClick={connectHandler}>
				            Connect Wallet
				          </CustomButton>
				        )}
				        { (web3Provider && !web3Loading && !userLoading && !userExists) &&
				          <CustomButton isLoading={web3Loading || userLoading} mr={3} onClick={createUserHandler}> 
				        	Create Account
				          </CustomButton>
				        }
			        </Flex>
			        <Flex h='5vh' justify='center' alignItems='center'>
			        	<b><a href="https://github.com/vintageplayer/highfy-me">Github</a></b>&nbsp;|&nbsp;
			        	<b><a href="https://twitter.com/HighFyMe">Twitter</a></b>
			        </Flex>
			        <Flex h='40vh' justify='center' alignItems='center'>
			        </Flex>
		        </Box>
	        </Grid>
	      </main>
		</div>
	);
}