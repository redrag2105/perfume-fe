// Centralized validation rules for all forms across the app

// Email 
export const validateEmail = (email: string): string => {
  if (!email.trim()) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Invalid email format';
  return '';
};

// Password 
export const validatePassword = (password: string): string => {
  if (!password) return 'Password is required';
  return '';
};

// Name 
export const validateName = (name: string): string => {
  if (!name.trim()) return 'Name is required';
  return '';
};

// YOB
export const validateYOB = (yob: string): string => {
  if (!yob) return 'Year of birth is required';
  const yobNum = parseInt(yob);
  if (isNaN(yobNum)) return 'Invalid year';
  if (yobNum < 1900) return 'Year must be after 1900';
  const currentYear = new Date().getFullYear();
  if (yobNum > currentYear) return 'Year cannot be in the future';
  return '';
};

// Brand name 
export const validateBrandName = (brandName: string): string => {
  if (!brandName.trim()) return 'Brand name is required';
  return '';
};

// Perfume form 
export const validatePerfumeName = (name: string): string => {
  if (!name.trim()) return 'Fragrance name is required';
  return '';
};

export const validatePerfumeUri = (uri: string): string => {
  if (!uri.trim()) return 'Image URL is required';
  try {
    new URL(uri);
    if (!uri.startsWith('http://') && !uri.startsWith('https://')) {
      return 'URL must start with http:// or https://';
    }
  } catch {
    return 'Invalid URL format';
  }
  return '';
};

export const validatePerfumePrice = (price: string): string => {
  if (!price) return 'Price is required';
  const priceNum = parseFloat(price);
  if (isNaN(priceNum) || priceNum < 0) return 'Price must be a positive number';
  return '';
};

export const validatePerfumeVolume = (volume: string): string => {
  if (!volume) return 'Volume is required';
  const volumeNum = parseInt(volume);
  if (isNaN(volumeNum) || volumeNum <= 0) return 'Volume must be a positive number';
  return '';
};

export const validatePerfumeBrand = (brandId: string): string => {
  if (!brandId) return 'Maison is required';
  return '';
};

export const validatePerfumeDescription = (description: string): string => {
  if (!description.trim()) return 'Description is required';
  if (description.trim().length < 10) return 'Description must be at least 10 characters';
  return '';
};

export const validatePerfumeIngredients = (ingredients: string): string => {
  if (!ingredients.trim()) return 'Ingredients are required';
  return '';
};

// Login form 
export interface LoginFormErrors {
  email: string;
  password: string;
}

export const validateLoginForm = (email: string, password: string): LoginFormErrors => ({
  email: validateEmail(email),
  password: validatePassword(password),
});

export const isLoginFormValid = (errors: LoginFormErrors): boolean => {
  return !errors.email && !errors.password;
};

// Register form 
export interface RegisterFormErrors {
  name: string;
  email: string;
  password: string;
  YOB: string;
}

export const validateRegisterForm = (
  name: string,
  email: string,
  password: string,
  yob: string
): RegisterFormErrors => ({
  name: validateName(name),
  email: validateEmail(email),
  password: validatePassword(password),
  YOB: validateYOB(yob),
});

export const isRegisterFormValid = (errors: RegisterFormErrors): boolean => {
  return !errors.name && !errors.email && !errors.password && !errors.YOB;
};

// Perfume form 
export interface PerfumeFormErrors {
  perfumeName: string;
  uri: string;
  price: string;
  volume: string;
  brand: string;
  description: string;
  ingredients: string;
}

export const validatePerfumeForm = (form: {
  perfumeName: string;
  uri: string;
  price: string;
  volume: string;
  brand: string;
  description: string;
  ingredients: string;
}): PerfumeFormErrors => ({
  perfumeName: validatePerfumeName(form.perfumeName),
  uri: validatePerfumeUri(form.uri),
  price: validatePerfumePrice(form.price),
  volume: validatePerfumeVolume(form.volume),
  brand: validatePerfumeBrand(form.brand),
  description: validatePerfumeDescription(form.description),
  ingredients: validatePerfumeIngredients(form.ingredients),
});

export const isPerfumeFormValid = (errors: PerfumeFormErrors): boolean => {
  return !errors.perfumeName && !errors.uri && !errors.price && !errors.volume && !errors.brand && !errors.description && !errors.ingredients;
};
