'use client';

import { Fragment, useState, useEffect } from 'react';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/modal';

import Script from 'next/script';
import Image from 'next/image';
import logo from '../public/assets/all8-webworks-web-design-and-development-logo.png';
import { sendContactForm } from '../actions/contact';
import { emailValidate, stringValidate } from '../lib/input-utils';
import useInput from '../hooks/use-input';
import { Spinner } from '@heroui/spinner';
import { Input, Textarea } from '@heroui/input';

import { Button } from '@heroui/button';

const workTypeOptions = [
  'Other',
  'Foundation Excavation',
  'Site Grading',
  'Land Clearing',
  'Demolition',
  'Retaining Walls',
  'Utility Trenches',
  'Erosion Control',
  'Septic System',
  'Drainage',
  'Dump Truck Services',
  'Equipment Hauling',
  'Gravel Delivery',
  'Sand Delivery',
  'Topsoil Delivery',
  'Fill Dirt',
  'Driveway',
  'Parking Lot',
];

const ContactForm = () => {
  //   const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedWorkType, setSelectedWorkType] = useState('');
  const [customWorkType, setCustomWorkType] = useState('');
  const [isRecaptchaReady, setIsRecaptchaReady] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // useEffect(() => {
  //   const checkRecaptcha = setInterval(() => {
  //     if (typeof window !== 'undefined' && window.grecaptcha?.execute) {
  //       setIsRecaptchaReady(true);
  //       clearInterval(checkRecaptcha);
  //     }
  //   }, 500);
  //   return () => clearInterval(checkRecaptcha);
  // }, []);

  const nameInput = useInput(stringValidate);
  const emailInput = useInput(emailValidate);
  const phoneInput = useInput(stringValidate);
  const messageInput = useInput(stringValidate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.isValid || !messageInput.isValid) {
      emailInput.inputBlurHandler();
      messageInput.inputBlurHandler();
      return;
    }

    try {
      if (!isRecaptchaReady || typeof window.grecaptcha === 'undefined') {
        throw new Error('reCAPTCHA not ready');
      }

      const token = await window.grecaptcha.execute(recaptchaSiteKey, {
        action: 'submit',
      });
      setLoading(true);

      const result = await sendContactForm({
        name: nameInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
        workType: `${selectedWorkType} ${customWorkType}`,
        message: messageInput.value,
        token,
      });

      if (result?.success) {
        nameInput.reset();
        emailInput.reset();
        messageInput.reset();
        phoneInput.reset();
        setSelectedWorkType('');
        setCustomWorkType('');
        setStatus('Success: Your request has been sent.');
        onOpen();
        setLoading(false);

        if ((window as any).gtag) {
          (window as any).gtag('event', 'conversion', {
            send_to: 'AW-16958173496/gn9BCIyi-7QaELjipJY_',
          });
        }
      } else {
        setLoading(false);
        setStatus('Error: ' + (result?.error || 'Unknown error occurred'));
      }
    } catch (error) {
      setStatus(
        `Error: ${
          error instanceof Error ? error.message : 'Something went wrong.'
        }`
      );
    }
  };

  return (
    <Fragment>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`}
        strategy="lazyOnload"
      />

      <Button onPress={onOpen}>Open Modal</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modal Title
              </ModalHeader>
              <ModalBody>
                <div className="text-center space-y-4 p-6">
                  <Image
                    src={logo}
                    alt="Bellhouse Logo"
                    width={256}
                    height={53}
                    className="mx-auto"
                  />
                  <h3 className="text-xl font-bold">Thank You!</h3>
                  <p>
                    Your request has been received. We'll be in touch shortly.
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <section className="bg-gray-100 py-16 px-6">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 space-y-6"
        >
          <h2 className="text-2xl font-bold text-center">
            Tell us about your project
          </h2>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Your Name
            </label>
            <Input
              id="name"
              value={nameInput.value}
              onChange={nameInput.valueChangeHandler}
              onBlur={nameInput.inputBlurHandler}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Your Email
            </label>
            <Input
              id="email"
              type="email"
              value={emailInput.value}
              onChange={emailInput.valueChangeHandler}
              onBlur={emailInput.inputBlurHandler}
              className={emailInput.hasError ? 'border-red-500' : ''}
            />
            {emailInput.hasError && (
              <p className="text-red-500 text-sm mt-1">
                Please enter a valid email.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Your Phone Number
            </label>
            <Input
              id="phone"
              value={phoneInput.value}
              onChange={phoneInput.valueChangeHandler}
              onBlur={phoneInput.inputBlurHandler}
            />
          </div>

          <div>
            <label
              htmlFor="workType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Type of Work Required
            </label>
            <select
              id="workType"
              className="w-full border rounded px-4 py-2"
              value={selectedWorkType}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedWorkType(val);
                if (val !== 'Other') setCustomWorkType('');
              }}
            >
              <option value="">-- Select Work Type --</option>
              {workTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {selectedWorkType === 'Other' && (
            <div>
              <label
                htmlFor="customWorkType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Please Specify
              </label>
              <Input
                id="customWorkType"
                value={customWorkType}
                onChange={(e) => setCustomWorkType(e.target.value)}
                placeholder="Enter custom work type"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              How Can We Help You?
            </label>
            <Textarea
              id="message"
              rows={5}
              value={messageInput.value}
              onChange={messageInput.valueChangeHandler}
              onBlur={messageInput.inputBlurHandler}
              className={messageInput.hasError ? 'border-red-500' : ''}
            />
            {messageInput.hasError && (
              <p className="text-red-500 text-sm mt-1">
                Please enter a message.
              </p>
            )}
          </div>

          <div className="text-center">
            {!loading ? (
              <Button type="submit" disabled={!isRecaptchaReady}>
                {isRecaptchaReady ? 'Send Message' : 'Loading ReCAPTCHA...'}
              </Button>
            ) : (
              <Spinner />
            )}
          </div>

          {status && <p className="text-center text-red-500 mt-4">{status}</p>}
        </form>
      </section>
    </Fragment>
  );
};

ContactForm.displayName = 'ContactForm';

export default ContactForm;
