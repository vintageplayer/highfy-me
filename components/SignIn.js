import { Flex, Button, Text, Switch } from "@chakra-ui/core";
import {useContext} from 'react';
import UserContext from "../context/user/UserContext";

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
	const {toogleGasMode, isGasless} = useContext(UserContext);
	return (
		<div>
	      <main>
			  <div>
				  <row style={{"display": "flow-root"}}>
				  <column style={{"float": "left"}}><h1 className="title">HighFy Me</h1></column>
				  <column style={{"float": "right"}}>Use Gasless mode ? <Switch isChecked={isGasless}  onChange={(e) => toogleGasMode()} size='sm' /> </column>
				  </row>
				  
			  </div>
	           
			
	        <Flex h='35vh' justify='center' alignItems='center' bg='#e5f4f1'></Flex>
			
	        <Flex h='5vh' justify='center' alignItems='center' bg='#e5f4f1'>
	        { !web3Provider ? (
	        		<Text>{web3DisplayMessage}</Text>
	        	) : (
	        		<Text>{userDisplayMessage}</Text>
	        	)
	        }
	        </Flex>
        	<Flex h='15vh' justify='center' alignItems='center' bg='#e5f4f1'>
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
	        <Flex h='45vh' justify='center' alignItems='center' bg='#e5f4f1'></Flex>
	      </main>
		</div>
	);
}