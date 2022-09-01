import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { User } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../../atoms/authModalAtom";
import { auth, firestore } from "../../../firebase/clientApp";
import { FIREBASE_ERRORS } from "../../../firebase/errors";

const Signup: React.FC = () => {
  const setAuthModalState = useSetRecoilState(authModalState);

  const [signUpForm, setSignUpForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const [createUserWithEmailAndPassword, userCred, loading, userError] =
    useCreateUserWithEmailAndPassword(auth);

  // Firebase logic
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (error) setError("");

    if (signUpForm.password !== signUpForm.confirmPassword) {
      // setError
      setError("passwords do not match");
      return;
    }
    createUserWithEmailAndPassword(signUpForm.email, signUpForm.password);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // update form state
    setSignUpForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const createUserDocument = async (user: User) => {
    await addDoc(
      collection(firestore, "users"),
      JSON.parse(JSON.stringify(user))
    );
  };

  useEffect(() => {
    if (userCred) {
      createUserDocument(userCred.user);
    }
  }, [userCred]);

  return (
    <form onSubmit={onSubmit}>
      <Input
        name="email"
        placeholder="email"
        type={"email"}
        mb="2"
        onChange={onChange}
        required
        fontSize={"10pt"}
        _placeholder={{ color: "gray.500" }}
        _hover={{
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        bg="gray.50"
      />
      <Input
        name="password"
        placeholder="password"
        type="password"
        onChange={onChange}
        required
        mb="2"
        fontSize={"10pt"}
        _placeholder={{ color: "gray.500" }}
        _hover={{
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        bg="gray.50"
      />

      <Input
        name="confirmPassword"
        placeholder="confirm password"
        type="password"
        onChange={onChange}
        required
        mb="2"
        fontSize={"10pt"}
        _placeholder={{ color: "gray.500" }}
        _hover={{
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        bg="gray.50"
      />

      <Text textAlign={"center"} color="red" fontSize={"10pt"}>
        {error ||
          FIREBASE_ERRORS[userError?.message as keyof typeof FIREBASE_ERRORS]}
      </Text>

      <Button
        type="submit"
        width={"100%"}
        height="36px"
        mt={2}
        mb={2}
        isLoading={loading}
      >
        Sign Up
      </Button>
      <Flex fontSize={"9pt"} justifyContent="center">
        <Text mr="1">Already a redditor?</Text>
        <Text
          onClick={() =>
            setAuthModalState((prev) => ({
              ...prev,
              view: "login",
            }))
          }
          color={"blue.500"}
          fontWeight="700"
          cursor={"pointer"}
        >
          LOG IN
        </Text>
      </Flex>
    </form>
  );
};
export default Signup;
