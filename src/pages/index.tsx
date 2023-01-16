import * as React from 'react';
import type { HeadFC, PageProps } from 'gatsby';
import { Formik, useFormikContext, Form, Field, FormikConfig, FormikContextType } from 'formik';
import '../styles/index.css';
import { products } from '../data/products';
import { createPropertyMap } from '../utils/createPropertyMap';
import FormikEffect from '../components/FormikEffect';

const [getProductByProperty] = createPropertyMap(products);

const IndexPage: React.FC<PageProps> = () => { 
  return (
    <main>
      <div className="content">
        <h1>{'Shop'}</h1>
        <h2>{'Shower gel'}</h2>
        <ProductForm />
      </div>
    </main>
  )
}

type FormValues = {
  tube_size: string;
  scent: string;
  pack_size: string;
};

const initialValues: FormValues = { tube_size: '473', scent: 'fig', pack_size: '1-bottle' };

const onChange = ({ nextValues, prevValues, changes, formik }:
  { 
    prevValues: FormValues,
    nextValues: FormValues,
    changes: Partial<FormValues>,
    formik: FormikContextType<FormValues>
  }) => {

  if (!getProductByProperty({...nextValues})) {
    const validProduct = products.find(({ properties }) => properties.some(({ type, value }) => changes[type as keyof FormValues] === value ));
    let values: Partial<FormValues> = {};
    
    for (let property of validProduct?.properties ?? []) {
      values[property.type as keyof FormValues] = property.value;
    }
    
    formik.resetForm({
      values: values as FormValues,
    })
    console.log('values: ', values);
  }
};

const ProductForm: React.FC = () => {  
  const formikprops: FormikConfig<FormValues> = {
    enableReinitialize: true,  
    initialValues,
    onSubmit: 
      values => {
        alert(JSON.stringify(getProductByProperty(values), null, 2));
      },
  };

  return (
    <Formik {...formikprops}>
      <>
        <ProductFormFields />
        <FormikEffect onChange={onChange} />
      </>
    </Formik>
  );
};

const ProductFormFields: React.FC = () => {
  const { values } = useFormikContext<FormValues>();

  return (
    <Form>
      <Field as="select" name="tube_size" id="tube_size">
        <option value="473">Full Size (473 ml)</option>
        <option value="60">Travel (60 ml)</option>
      </Field>
      
      <div>
        <label htmlFor="scent">
          <Field type="radio" name="scent" value={'wildlands'} />
          {'Wildlands'}
        </label>
        
        <label htmlFor="scent">
          <Field type="radio" name="scent" value="shiso" />
          {'Shiso'}
        </label>

        <label htmlFor="scent">
          <Field type="radio" name="scent" value="fig" />
          {'Fig'}
        </label>

        <label htmlFor="scent">
          <Field type="radio" name="scent" value="stone" />
          {'Stone'}
        </label>

        <label htmlFor="scent">
          <Field type="radio" name="scent" value="redwood" />
          {'Redwood'}
        </label>

        <label htmlFor="scent">
          <Field type="radio" name="scent" value="5-scents" />
          {'5 Scents'}
        </label>
      </div>

      <div>
        <label htmlFor="pack_size">
          <Field type="radio" name="pack_size" value="1-bottle" disabled={!getProductByProperty({...values, pack_size: '1-bottle'})} />
          {'1 Bottle'}
        </label>

        <label htmlFor="pack_size">
          <Field type="radio" name="pack_size" value="2-bottle" disabled={!getProductByProperty({...values, pack_size: '2-bottle'})} />
          {'2 Bottles'}
        </label>

        <label htmlFor="pack_size">
          <Field type="radio" name="pack_size" value="3-bottle" disabled={!getProductByProperty({...values, pack_size: '3-bottle'})} />
          {'3 Bottles'}
        </label>

        <label htmlFor="pack_size">
          <Field type="radio" name="pack_size" value="5-bottle" disabled={!getProductByProperty({...values, pack_size: '5-bottle'})} />
          {'5 Bottle'}
        </label>
      </div>

      <input type="submit" value="Add to cart" />
    </Form>
  );
}

const UserSelectionSummary: React.FC = () => {
  const { values } = useFormikContext<any>();

  return (
    <div>
      {values}
    </div>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>
